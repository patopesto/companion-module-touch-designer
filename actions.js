

export const UpdateActions = async function (instance) {
    const sendOscMessage = async (path, args) => {
        instance.log('debug', `Sending OSC ${instance.config.host}:${instance.config.port} ${path}`)
        instance.log('debug', `Sending Args ${JSON.stringify(args)}`)

        await instance.client.sendCommand(path, args)
            .then(() => {
                instance.log('info', `Command sent successfully. Path: ${path}, Args: ${JSON.stringify(args)}`);
            })
            .catch(err => {
                instance.log('error', `Failed to send command:`, err.message);
            })
    }

    instance.setActionDefinitions({
        sample_action: {
            name: 'My First Action',
            options: [
                {
                    id: 'num',
                    type: 'number',
                    label: 'Test',
                    default: 5,
                    min: 0,
                    max: 100,
                },
            ],
            callback: async (event) => {
                console.log('Hello world!', event.options.num)
            },
        },
        operator_parameter: {
            name: 'Operator Parameter',
            options: [
                {
                    id: 'op_name',
                    type: 'textinput',
                    label: 'Operator Name',
                    default: '',
                },
                {
                    id: 'parameter',
                    type: 'textinput',
                    label: 'Operator Parameter',
                    default: '',
                },
                {
                    id: 'type',
                    type: 'dropdown',
                    label: 'Type',
                    choices: [
                        { id: 'int', label: 'Number' },
                        { id: 'float', label: 'Float' },
                        { id: 'string', label: 'String' },
                    ],
                    default: 'int'
                },
                {
                    id: 'value',
                    type: 'textinput',
                    label: 'Value',
                    default: '',
                },
            ],
            callback: async (event) => {
                console.log('Press', event)
                const op = await instance.parseVariablesInString(event.options.op_name)
                const parameter = await instance.parseVariablesInString(event.options.parameter)
                const value = await instance.parseVariablesInString(event.options.value)

                const path = `/op/${op}/param/${parameter}`
                const args = [
                    {
                        type: 'i',
                        value: value,
                    },
                ]
                sendOscMessage(path, args)
                instance.state.updateOpState(op, parameter, value)
            },
        },
    })
}
