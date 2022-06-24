/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment,max-len,import/order */

import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const root = ReactDOM.createRoot(document.querySelector('#root')!)

import { world } from './scene'
import { path } from './path'
import { getDimensions, renderBackground, renderDebug } from './ecs/system/render'
import { startGameLoop } from './game-loop'
import type { Coordinate } from './ecs/geometry'

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

path(world)

let mouseCoords: Coordinate | null = null
const dimensions = getDimensions(world, { cellSizePx: 50, gridOffsetPx: 50 })

const container = document.querySelector<HTMLDivElement>('#canvases')!
container.style.width = `${dimensions.totalWidth}px`
container.style.height = `${dimensions.totalHeight}px`

container.addEventListener('mousemove', (event: MouseEvent): void => {
    const { gridOffsetPx, cellSizePx } = dimensions
    const { offsetLeft, offsetTop } = event.target as HTMLDivElement
    const x = event.clientX - offsetLeft - gridOffsetPx
    const y = event.clientY - offsetTop - gridOffsetPx

    mouseCoords =
        x < 0 || x > world.columns * cellSizePx || y < 0 || y > world.rows * cellSizePx
            ? null
            : [Math.floor(x / cellSizePx), Math.floor(y / cellSizePx)]
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

renderBackground(world, dimensions, bgCtx)

startGameLoop(fps => {
    renderDebug(world, dimensions, debugCtx, fps, mouseCoords, 15)
})

world.onTagAdded(({ tag, entity }) => console.info(`Tag ${tag} added to entity ${entity} created`))
world.onTagRemoved(({ tag, entity }) =>
    console.info(`Tag ${tag} removed from entity ${entity} created`),
)
world.onEntityDeleted(({ entity }) => console.info(`Entity ${entity} deleted`))
world.onEntityCreated(({ entity }) => console.info(`Entity ${entity} created`))
world.onEntityDeleted(({ entity }) => console.info(`Entity ${entity} deleted`))
world.onComponentAdded(({ component, entity }) =>
    console.info(`Component ${component.getType()} added to entity ${entity}`),
)
world.onComponentRemoved(({ component, entity }) =>
    console.info(`Component ${component.getType()} removed from entity ${entity}`),
)
