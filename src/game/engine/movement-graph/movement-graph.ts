import type { Graph } from 'ngraph.graph'
import createGraph from 'ngraph.graph'
import type { PathFinder } from 'ngraph.path'
import { nba } from 'ngraph.path'

import type { IReadonlyWorld, Signal } from '../../../ecs'
import { GlobalState, signal } from '../../../ecs'
import { obstructsMovement, Terrain } from '../../component'
import type { Coordinate } from '../../geometry'
import { COLUMN, ROW } from '../../geometry'

import { canMoveAdjacent } from './can-move-adjacent'
import { Direction, directionDelta, isDiagonal } from './direction'
import { nodeId as $ } from './node-id'

type AdjacentMovementGraph = Graph<Coordinate, number>

const RECALCULATE_ADJACENT_MOVEMENT = signal('recalculate-adjacent-movement')

export class MovementGraph extends GlobalState {
    public readonly MOVEMENT_COST_ORTHOGONAL = 2
    public readonly MOVEMENT_COST_DIAGONAL = 3

    private readonly graph: AdjacentMovementGraph
    private readonly pathFinder: PathFinder<Coordinate>

    public constructor(world: IReadonlyWorld) {
        super(world)

        this.graph = createGraph()
        this.pathFinder = nba(this.graph, {
            distance: (_from, _to, link) => link.data,
        })

        this.world.signal(RECALCULATE_ADJACENT_MOVEMENT)

        this.world.onComponentAdded(({ component }) => {
            if (component instanceof Terrain) {
                this.world.signal(RECALCULATE_ADJACENT_MOVEMENT)
            }
        })
        this.world.onComponentRemoved(({ component }) => {
            if (component instanceof Terrain) {
                this.world.signal(RECALCULATE_ADJACENT_MOVEMENT)
            }
        })
        this.world.onTagAdded(({ tag }) => {
            if (tag === obstructsMovement) {
                this.world.signal(RECALCULATE_ADJACENT_MOVEMENT)
            }
        })
        this.world.onTagRemoved(({ tag }) => {
            if (tag === obstructsMovement) {
                this.world.signal(RECALCULATE_ADJACENT_MOVEMENT)
            }
        })
    }

    public getShortestPath(from: Coordinate, to: Coordinate): Coordinate[] | null {
        const result = this.pathFinder.find($(from), $(to))

        return result.length === 0 ? null : result.map(node => node.data)
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

    public override onStepStart(signals: ReadonlySet<Signal>): void {
        if (!signals.has(RECALCULATE_ADJACENT_MOVEMENT)) {
            return
        }

        console.log(`Recalculating adjacency for movement`)

        const start = performance.now()
        this.update()
        const durationMs = performance.now() - start

        console.log(`Calculation took ${durationMs.toFixed(1)}ms`)
    }

    protected update(): void {
        // This could be improved by not recalculating everything but only updating the (potentially) affected nodes.
        // Though for that to work we would somehow need to include that information in the signal - which are data-less
        // right now on purpose.

        // It would be sufficient to remove the links only, but it doesn't look like there's an API for that.
        this.graph.clear()

        for (let column = 0; column < this.world.columns; column++) {
            for (let row = 0; row < this.world.rows; row++) {
                this.graph.addNode($([column, row]), [column, row])
            }
        }

        for (let column = 0; column < this.world.columns; column++) {
            for (let row = 0; row < this.world.rows; row++) {
                /* eslint-disable unicorn/no-array-for-each */
                Object.values(Direction)
                    .map<[Direction, Coordinate, number]>(direction => {
                        const [dc, dr] = directionDelta[direction]
                        return [
                            direction,
                            [column + dc, row + dr],
                            isDiagonal(direction)
                                ? this.MOVEMENT_COST_DIAGONAL
                                : this.MOVEMENT_COST_ORTHOGONAL,
                        ]
                    })
                    .filter(
                        ([direction, neighbor, _cost]) =>
                            neighbor[ROW] >= 0 &&
                            neighbor[ROW] < this.world.rows &&
                            neighbor[COLUMN] >= 0 &&
                            neighbor[COLUMN] < this.world.columns &&
                            canMoveAdjacent(this.world, [column, row], direction),
                    )
                    .forEach(([_, neighbor, cost]) => {
                        this.graph.addLink($([column, row]), $(neighbor), cost)
                    })
                /* eslint-enable unicorn/no-array-for-each */
            }
        }
    }
}
