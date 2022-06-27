/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment,max-len,import/order */

import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const root = ReactDOM.createRoot(document.querySelector('#root')!)

import { world } from './scene'
import { startGameLoop } from './game-loop'
import type { Coordinate } from './game/geometry'
import { getDimensions, renderBackground, renderDebug } from './game/system/render'
import { createWallsFromPoints } from './game/entity'
import { MovementGraph } from './game/engine/movement-graph'
import { Destination, Origin } from './game/engine'

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

const dimensions = getDimensions(world, { cellSizePx: 50, gridOffsetPx: 50 })

const container = document.querySelector<HTMLDivElement>('#canvases')!
container.style.width = `${dimensions.totalWidth}px`
container.style.height = `${dimensions.totalHeight}px`

container.addEventListener('mousemove', (event: MouseEvent): void => {
    const { gridOffsetPx, cellSizePx } = dimensions
    const { offsetLeft, offsetTop } = event.target as HTMLDivElement
    const x = event.clientX - offsetLeft - gridOffsetPx
    const y = event.clientY - offsetTop - gridOffsetPx

    const newMouseCoords: Coordinate | null =
        x < 0 || x > world.columns * cellSizePx || y < 0 || y > world.rows * cellSizePx
            ? null
            : [Math.floor(x / cellSizePx), Math.floor(y / cellSizePx)]

    world.getGlobalState(Origin).set(newMouseCoords)
})

container.addEventListener('click', (event: MouseEvent): void => {
    const { gridOffsetPx, cellSizePx } = dimensions
    const { offsetLeft, offsetTop } = event.target as HTMLDivElement
    const x = event.clientX - offsetLeft - gridOffsetPx
    const y = event.clientY - offsetTop - gridOffsetPx

    const newMouseCoords: Coordinate | null =
        x < 0 || x > world.columns * cellSizePx || y < 0 || y > world.rows * cellSizePx
            ? null
            : [Math.floor(x / cellSizePx), Math.floor(y / cellSizePx)]

    world.getGlobalState(Destination).set(newMouseCoords)
})

const background = document.querySelector<HTMLCanvasElement>('canvas.background')!
const foreground = document.querySelector<HTMLCanvasElement>('canvas.foreground')!
const debug = document.querySelector<HTMLCanvasElement>('canvas.foreground')!

const bgCtx = background.getContext('2d')!
const fgCtx = foreground.getContext('2d')!
const debugCtx = debug.getContext('2d')!

background.width = dimensions.totalWidth
background.height = dimensions.totalHeight
foreground.width = dimensions.totalWidth
foreground.height = dimensions.totalHeight
debug.width = dimensions.totalWidth
debug.height = dimensions.totalHeight

let averageFps = 0

world.addGlobalState(new MovementGraph(world))
world.addGlobalState(new Origin(world))
world.addGlobalState(new Destination(world))

world.addSystem(world => renderBackground(world, dimensions, bgCtx))
world.addSystem(world => renderDebug(world, dimensions, debugCtx, averageFps, 15))

startGameLoop((time, fps) => {
    averageFps = fps
    world.step()
})

world.onTagAdded(({ tag, entity }) => console.info(`Tag ${tag} added to entity ${entity} created`))
world.onTagRemoved(({ tag, entity }) =>
    console.info(`Tag ${tag} removed from entity ${entity} created`),
)
world.onEntityDeleted(({ entity }) => {
    console.info(`Entity ${entity} deleted`)
})
world.onEntityCreated(({ entity }) => {
    console.info(`Entity ${entity} created`)
})
world.onEntityDeleted(({ entity }) => {
    console.info(`Entity ${entity} deleted`)
})
world.onComponentAdded(({ component, entity }) => {
    console.info(`Component ${component.getType()} added to entity ${entity}`)
})
world.onComponentRemoved(({ component, entity }) => {
    console.info(`Component ${component.getType()} removed from entity ${entity}`)
})
world.onTagAdded(({ tag, entity }) => {
    console.info(`Tag ${tag} added to entity ${entity}`)
})
world.onTagRemoved(({ tag, entity }) => {
    console.info(`Tag ${tag} removed from entity ${entity}`)
})

setTimeout(() => {
    createWallsFromPoints(world, [
        [18, 3],
        [18, 7],
    ])
}, 3000)
