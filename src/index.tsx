/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment,max-len */

import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'
import { Component, World } from './ecs/world'

const world = new World()
const root = ReactDOM.createRoot(document.querySelector('#root')!)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

class HP extends Component {
    public maximum: number
    public current: number

    public constructor(data: { maximum: number; current: number }) {
        super()

        this.maximum = data.maximum
        this.current = data.current
    }
}

class Position extends Component {
    public x: number
    public y: number

    public constructor(data: { x: number; y: number }) {
        super()

        this.x = data.x
        this.y = data.y
    }
}

const player = world.createEntity({ name: 'player' })
const room = world.createEntity({ name: 'room' })
const walls = [
    world.createEntity({ name: 'wall 1', parent: room }),
    world.createEntity({ name: 'wall 2', parent: room }),
    world.createEntity({ name: 'wall 3', parent: room }),
    world.createEntity({ name: 'wall 4', parent: room }),
]

world.registerComponentTypes(HP, Position)
world.addComponent(
    player,
    new HP({
        maximum: 30,
        current: 25,
    }),
)
world.addComponent(
    player,
    new Position({
        x: 42,
        y: 17,
    }),
)

console.log({
    hp: world.getComponent(player, HP),
    position: world.getComponent(player, Position),
})

world.removeComponent(player, Position)
console.log({
    hp: world.getComponent(player, HP),
    position: world.getComponent(player, Position),
})

// @ts-expect-error
window.world = world
// @ts-expect-error
window.component = { HP, Position }
