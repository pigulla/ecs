/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import App from './App'
import { World } from './ecs/world'

const world = new World()
const root = ReactDOM.createRoot(document.querySelector('#root')!)

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

// @ts-expect-error
window.world = world

// console.dir(world.createComponent('foo', { n: 'one' }))
// console.dir(world.createComponent('foo', { n: 'two' }))
//
// console.dir(world.getComponent('foo', 0))
// console.dir(world.getComponent('foo', 1))

interface HP {
    maximum: number
    current: number
}

const player = world.createEntity('player')
const HP = world.registerComponentType('hp')
world.addComponent<HP>(player, HP, {
    maximum: 30,
    current: 25,
})

const result = world.getComponent<HP>(player, HP)

console.dir(result)
