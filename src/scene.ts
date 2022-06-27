import { createTag, World } from './ecs'
import { createDoor, createTerrain, createWallsFromPoints, createWindow } from './game/entity'

const world = new World(
    document,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.querySelector('#ecs')!,
    { columns: 25, rows: 15 },
)

const ROOM = createTag('room')
const room = world.createEntity({ name: 'Room' })

world.addTag(room, ROOM)

createWallsFromPoints(
    world,
    [
        [4, 6],
        [3, 6],
    ],
    room,
)
createWindow(world, { from: [3, 6], to: [2, 6] }, room)
createWallsFromPoints(
    world,
    [
        [2, 6],
        [1, 6],
        [1, 1],
        [8, 1],
        [8, 6],
        [7, 6],
    ],
    room,
)
createWindow(world, { from: [7, 6], to: [6, 6] }, room)
createWallsFromPoints(
    world,
    [
        [6, 6],
        [5, 6],
    ],
    room,
)
createWindow(world, { from: [6, 6], to: [5, 6] }, room)
createDoor(world, { from: [5, 6], to: [4, 6] }, room)
createWallsFromPoints(world, [
    [5, 7],
    [7, 7],
    [7, 9],
    [9, 9],
    [9, 11],
])

createTerrain(world, { coordinate: [13, 6], additionalCost: 3 })
createTerrain(world, { coordinate: [12, 7], additionalCost: 3 })
createTerrain(world, { coordinate: [13, 7], additionalCost: 5 })
createTerrain(world, { coordinate: [14, 7], additionalCost: 3 })
createTerrain(world, { coordinate: [11, 8], additionalCost: 3 })
createTerrain(world, { coordinate: [12, 8], additionalCost: 5 })
createTerrain(world, { coordinate: [13, 8], additionalCost: 5 })
createTerrain(world, { coordinate: [14, 8], additionalCost: 5 })
createTerrain(world, { coordinate: [15, 8], additionalCost: 3 })
createTerrain(world, { coordinate: [12, 9], additionalCost: 3 })
createTerrain(world, { coordinate: [13, 9], additionalCost: 5 })
createTerrain(world, { coordinate: [14, 9], additionalCost: 3 })
createTerrain(world, { coordinate: [13, 10], additionalCost: 3 })

export { world }
