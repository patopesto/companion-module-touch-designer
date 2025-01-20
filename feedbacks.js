import { combineRgb } from '@companion-module/base'


export const UpdateFeedbacks = async function (instance) {
	instance.setFeedbackDefinitions({
		ChannelState: {
			name: 'Example Feedback',
			type: 'boolean',
			label: 'Channel State',
			defaultStyle: {
				bgcolor: combineRgb(255, 0, 0),
				color: combineRgb(0, 0, 0),
			},
			options: [
				{
					id: 'num',
					type: 'number',
					label: 'Test',
					default: 5,
					min: 0,
					max: 10,
				},
			],
			callback: (feedback) => {
				console.log('Hello world!', feedback.options.num)
				if (feedback.options.num > 5) {
					return true
				} else {
					return false
				}
			},
		},
		operator_parameter: {
			name: 'Operator Parameter value',
			type: 'boolean',
			label: 'Operator Parameter value',
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
				console.log('Feedback', feedback)
				const op = await context.parseVariablesInString(feedback.options.op_name)
                const parameter = await context.parseVariablesInString(feedback.options.parameter)

				const value = instance.state.getOpState(op, parameter)
				return Boolean(value)
			},
		},
	})
}
