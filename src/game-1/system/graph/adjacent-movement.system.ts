import type { Graph } from 'ngraph.graph'
import createGraph from 'ngraph.graph'

import type { ISystem, IWorld, Signal } from '../../../ecs'
import { signal } from '../../../ecs'
import type { Coordinate } from '../../../framework/geometry'
import { COLUMN, ROW } from '../../../framework/geometry'
import { obstructsMovement, Terrain } from '../../component'
import { Fact } from '../fact'

import { AdjacentMovement } from './adjacent-movement.component'
import { canMoveAdjacent } from './can-move-adjacent'
import { Direction, directionDelta, isDiagonal } from './direction'
import { nodeId as $ } from './node-id'

type AdjacentMovementGraph = Graph<Coordinate, number>

const MOVEMENT_COST_ORTHOGONAL = 2
const MOVEMENT_COST_DIAGONAL = 3

function update(world: IWorld<Fact>, graph: AdjacentMovementGraph): void {
    const rows = world.getFact<number>(Fact.ROWS)
    const columns = world.getFact<number>(Fact.COLUMNS)

    // It would be sufficient to remove the links only, but it doesn't look like there's an API for that.
    graph.clear()

    for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
            graph.addNode($([column, row]), [column, row])
        }
    }

    for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
            /* eslint-disable unicorn/no-array-for-each */
            Object.values(Direction)
                .map<[Direction, Coordinate, number]>(direction => {
                    const [dc, dr] = directionDelta[direction]
                    return [
                        direction,
                        [column + dc, row + dr],
                        isDiagonal(direction) ? MOVEMENT_COST_DIAGONAL : MOVEMENT_COST_ORTHOGONAL,
                    ]
                })
                .filter(
                    ([direction, neighbor, _cost]) =>
                        neighbor[ROW] >= 0 &&
                        neighbor[ROW] < rows &&
                        neighbor[COLUMN] >= 0 &&
                        neighbor[COLUMN] < columns &&
                        canMoveAdjacent(world, [column, row], direction),
                )
                .forEach(([_, neighbor, cost]) => {
                    graph.addLink($([column, row]), $(neighbor), cost)
                })
            /* eslint-enable unicorn/no-array-for-each */
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

    return function adjacentMovementSystem(world, signals: ReadonlySet<Signal>): void {
        if (signals.has(RECALCULATE_ADJACENT_MOVEMENT)) {
            console.log(`Recalculating adjacency for movement`)

            const start = performance.now()
            update(world, graph)
            const durationMs = performance.now() - start

            console.log(`Calculation took ${durationMs.toFixed(1)}ms`)
        }
    }
}
