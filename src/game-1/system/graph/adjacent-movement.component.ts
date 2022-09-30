import type { Graph } from 'ngraph.graph'

import { Component } from '../../../ecs'
import type { Coordinate } from '../../../framework/geometry'

import { nodeId as $ } from './node-id'

// Not really a data-only component, but it sort of is from the client's perspective.
export class AdjacentMovement extends Component {
    private readonly graph: Graph<Coordinate, number>

    public constructor(graph: Graph<Coordinate, number>) {
        super()

        this.graph = graph
    }

    public getCostToNeighbors(coordinate: Coordinate): [Coordinate, number][] {
        const node = this.graph.getNode($(coordinate))

        if (!node || !node.links) {
            return []
        }

        return [...node.links].map(link => [
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.graph.getNode(link.toId)!.data,
            link.data as number,
        ])
    }
}
