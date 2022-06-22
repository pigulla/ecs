import { World } from './ecs'
import { createTag } from './ecs/component'
import { createWallsFromPoints, createDoor, createWindow, createSand } from './ecs/entity'

const world = new World(document, { columns: 25, rows: 15 })

const ROOM = createTag('room')
const room = world.createEntity({ name: 'Room' })

room.addTag(ROOM)

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

createSand(world, { coordinate: [13, 5] })
createSand(world, { coordinate: [13, 6] })
createSand(world, { coordinate: [13, 7] })
createSand(world, { coordinate: [13, 8] })
createSand(world, { coordinate: [13, 9] })
createSand(world, { coordinate: [13, 10] })

world.updateNeighborsForMovement()

export { world }
