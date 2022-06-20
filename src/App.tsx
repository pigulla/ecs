import React from 'react'

import './App.css'
import { Canvas } from './component'
import type { IWorld } from './ecs'
import { getDimensions } from './ecs/system/render'

export function App(props: { world: IWorld }): JSX.Element {
    const dimensions = getDimensions(props.world, { cellSizePx: 50, gridOffsetPx: 50 })

    return (
        <div className="App">
            <Canvas dimensions={dimensions} />
        </div>
    )
}
