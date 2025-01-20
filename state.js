
export class State {
    constructor(root) {
        this.root = root
        this.ops = {}
    }

    updateOpState(op, param, value) {
        this.root.log('info', `Updating op state for ${op}.${param} = ${value}`)
        this.ops = {
            ...this.ops,
            [op]: {
                ...this.ops[op],
                [param]: value,
            }
        }
        console.log(this.ops)
    }

    getOpState(op, param) {
        let value = undefined
        if (op in this.ops) {
            value = this.ops[op][param]
        }
        this.root.log('debug', `Getting op state for ${op}.${param} = ${value}`)
        console.log(this.ops)
        return value
    }


}