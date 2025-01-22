import { combineRgb } from '@companion-module/base'


export const UpdateFeedbacks = async function (instance) {
    instance.setFeedbackDefinitions({
        operator_parameter: {
            name: 'Operator Parameter',
            type: 'boolean',
            description: 'Listen for an operator parameter value',
            defaultStyle: {
                bgcolor: combineRgb(255, 0, 0),
                color: combineRgb(0, 0, 0),
            },
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
                }
            ],
            callback: async (feedback, context) => {
                const op = await context.parseVariablesInString(feedback.options.op_name)
                const parameter = await context.parseVariablesInString(feedback.options.parameter)

                const value = instance.state.getOpState(op, parameter)
                return Boolean(value)
            },
            subscribe: (feedback) => {
                console.log('subscribe', feedback)
            },
            unsubscribe: (feedback) => {
                console.log('unsubscribe', feedback)
            },
        },
    })
}
