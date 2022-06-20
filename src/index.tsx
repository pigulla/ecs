/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment,max-len,import/order */

import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'

const root = ReactDOM.createRoot(document.querySelector('#root')!)

import { world } from './scene'

root.render(
    <React.StrictMode>
        <App world={world} />
    </React.StrictMode>,
)

// @ts-expect-error
window.world = world
