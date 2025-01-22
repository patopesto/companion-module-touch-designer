

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

    const getOSCType = (type, value) => {
        switch (type) {
            case 'int':
                return ['i', Number(value)]
            case 'float':
                return ['f', parseFloat(value)]
            case 'string':
                return ['s', value]
            case 'bool':
                if (value > 0) { // TODO: rework this
                    return ['T', null]
                }
                else {
                    return ['F', null]
                }

        }
        return [null, null]
    }

    instance.setActionDefinitions({
        operator_parameter: {
            name: 'Operator Parameter',
            description: 'Send an operator parameter',
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
                        { id: 'bool', label: 'Boolean' }, // Not ideal handling for now
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
                const [ type, osc_value ] = getOSCType(event.options.type, value)
                console.log(type, osc_value)
                const args = [
                    {
                        type: type,
                        value: osc_value,
                    },
                ]
                sendOscMessage(path, args)
                instance.state.updateOpState(op, parameter, value)
            },
        },
        expression: {
            name: 'Expression',
            description: 'Send a python expression',
            options: [
                {
                    id: 'value',
                    type: 'textinput',
                    label: 'Value',
                    default: '',
                },
            ],
            callback: async (event) => {
                console.log('Press expression', event)
                const value = await instance.parseVariablesInString(event.options.value)

                const path = `/python`
                const args = [
                    {
                        type: 's',
                        value: value,
                    },
                ]
                sendOscMessage(path, args)
            },
        },
    })
}
