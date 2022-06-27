import type { Graph } from 'ngraph.graph'
import createGraph from 'ngraph.graph'

import { Component, obstructsMovement, Terrain } from '../../component'
import type { Coordinate } from '../../geometry'
import { COLUMN, ROW } from '../../geometry'
import type { Signal } from '../../signal'
import { signal } from '../../signal'
import type { IWorld } from '../../world.interface'
import { hasLineOfMovement } from '../has-line-of-movement'
import type { ISystem } from '../system.interface'

function $(coordinate: Readonly<Coordinate>): string {
    return `${coordinate[COLUMN]}:${coordinate[ROW]}`
}

type AdjacentMovementGraph = Graph<Coordinate, number>

const MOVEMENT_COST_ORTHOGONAL = 2
const MOVEMENT_COST_DIAGONAL = 3

export enum Direction {
    NORTH = 'N',
    NORTH_EAST = 'NE',
    EAST = 'E',
    SOUTH_EAST = 'SE',
    SOUTH = 'S',
    SOUTH_WEST = 'SW',
    WEST = 'W',
    NORTH_WEST = 'NW',
}

// Not really a data-only component, but it sort of is from the client's perspective.
export class AdjacentMovement extends Component {
    private readonly graph: Graph<Coordinate, number>

    public constructor(graph: Graph<Coordinate, number>) {
        super()

        this.graph = graph
    }

    public getCostToNeighbors(coordinate: Readonly<Coordinate>): [Coordinate, number][] {
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

function update(world: IWorld, graph: AdjacentMovementGraph): void {
    // It would be sufficient to remove the links only, but it doesn't look like there's an API for that.
    graph.clear()

    for (let column = 0; column < world.columns; column++) {
        for (let row = 0; row < world.rows; row++) {
            graph.addNode($([column, row]), [column, row])
        }
    }

    for (let column = 0; column < world.columns; column++) {
        for (let row = 0; row < world.rows; row++) {
            const candidates: [Coordinate, number][] = [
                [[column - 1, row - 1], MOVEMENT_COST_DIAGONAL], //   NW
                [[column - 1, row + 0], MOVEMENT_COST_ORTHOGONAL], // W
                [[column - 1, row + 1], MOVEMENT_COST_DIAGONAL], //   SW
                [[column + 0, row - 1], MOVEMENT_COST_ORTHOGONAL], // N
                [[column + 0, row + 1], MOVEMENT_COST_ORTHOGONAL], // S
                [[column + 1, row - 1], MOVEMENT_COST_DIAGONAL], //   NE
                [[column + 1, row + 0], MOVEMENT_COST_ORTHOGONAL], // E
                [[column + 1, row + 1], MOVEMENT_COST_DIAGONAL], //   SE
            ]
            const adjacent = candidates.filter(
                ([neighbor, _cost]) =>
                    neighbor[ROW] >= 0 &&
                    neighbor[ROW] < world.rows &&
                    neighbor[COLUMN] >= 0 &&
                    neighbor[COLUMN] < world.columns &&
                    hasLineOfMovement(world, [column, row], neighbor),
            )

            for (const [neighbor, cost] of adjacent) {
                graph.addLink($([column, row]), $(neighbor), cost)
            }
        }
    }
}

export function createAdjacentMovementSystem(world: IWorld): ISystem {
    const RECALCULATE_ADJACENT_MOVEMENT = signal('recalculate-adjacent-movement')
    const graph: AdjacentMovementGraph = createGraph()
    const component = new AdjacentMovement(graph)

    const entity = world.createEntity({ name: 'graph' })
    world.setComponent(entity, component)
    world.signal(RECALCULATE_ADJACENT_MOVEMENT)

    world.onComponentAdded(({ component }) => {
        if (component instanceof Terrain) {
            world.signal(RECALCULATE_ADJACENT_MOVEMENT)
        }
    })
    world.onComponentRemoved(({ component }) => {
        if (component instanceof Terrain) {
            world.signal(RECALCULATE_ADJACENT_MOVEMENT)
        }
    })
    world.onTagAdded(({ tag }) => {
        if (tag === obstructsMovement) {
            world.signal(RECALCULATE_ADJACENT_MOVEMENT)
        }
    })
    world.onTagRemoved(({ tag }) => {
        if (tag === obstructsMovement) {
            world.signal(RECALCULATE_ADJACENT_MOVEMENT)
        }
    })

    return function adjacentMovementSystem(_world, signals: ReadonlySet<Signal>): void {
        if (signals.has(RECALCULATE_ADJACENT_MOVEMENT)) {
            console.log(`Recalculating adjacency for movement`)

            const start = performance.now()
            update(world, graph)
            const durationMs = performance.now() - start

            console.log(`Calculation took ${durationMs.toFixed(1)}ms`)
        }
    }
}
