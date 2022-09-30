import { Component } from '../../ecs'

export abstract class StepTrigger extends Component {
    public readonly triggerAtStep: number

    public constructor(data: { triggerAtStep: number }) {
        super()

        this.triggerAtStep = data.triggerAtStep
    }
}
