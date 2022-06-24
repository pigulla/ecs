/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment,max-len,import/order */

import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const root = ReactDOM.createRoot(document.querySelector('#root')!)

import { world } from './scene'
import { path } from './path'

root.render(
    <React.StrictMode>
        <App world={world} />
    </React.StrictMode>,
)

path(world)

// @ts-expect-error
window.world = world
