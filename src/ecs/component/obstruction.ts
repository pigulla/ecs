import { Component } from './component'

export enum ObstructionType {
    MOVEMENT = 'movement',
    SIGHT = 'sight',
}

export class Obstruction extends Component {
    private _obstructs: ReadonlySet<ObstructionType>

    public constructor(data: { obstructs: Iterable<ObstructionType> }) {
        super()

        this._obstructs = new Set(data.obstructs)
    }

    public set obstructs(types: Iterable<ObstructionType>) {
        this._obstructs = new Set(types)
    }

    public get obstructs(): ReadonlySet<ObstructionType> {
        return this._obstructs
    }

    public blocks(type: ObstructionType): boolean {
        return this._obstructs.has(type)
    }

    public blocksAll(types: Iterable<ObstructionType>): boolean {
        return [...types].every(type => this._obstructs.has(type))
    }

    public blocksAny(types: Iterable<ObstructionType>): boolean {
        return [...types].some(type => this._obstructs.has(type))
    }
}
