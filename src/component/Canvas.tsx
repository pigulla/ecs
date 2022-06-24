/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

import type { Coordinate } from '../ecs/geometry'
import { COLUMN, ROW } from '../ecs/geometry'
import type { Dimensions } from '../ecs/system/render'
import { renderBackground, renderDebug } from '../ecs/system/render'

export interface CanvasProps {
    dimensions: Dimensions
}

export function Canvas(props: CanvasProps): JSX.Element {
    const { gridOffsetPx, cellSizePx, totalHeight, totalWidth, world } = props.dimensions
    const [coords, setCoords] = useState<Coordinate | null>(null)

    function handleMouseMove(event: MouseEvent): void {
        const { offsetLeft, offsetTop } = event.target as HTMLDivElement
        const x = event.clientX - offsetLeft - gridOffsetPx
        const y = event.clientY - offsetTop - gridOffsetPx

        if (x < 0 || x > world.columns * cellSizePx || y < 0 || y > world.rows * cellSizePx) {
            setCoords(null)
        } else {
            const column = Math.floor(x / cellSizePx)
            const row = Math.floor(y / cellSizePx)

            if (coords === null || coords[COLUMN] !== column || coords[ROW] !== row) {
                setCoords([column, row])
            }
        }
    }

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                position: 'relative',
                width: totalWidth,
                height: totalHeight,
            }}
        >
            <BackgroundCanvas {...props} />
            <DebugCanvas {...props} origin={coords} availableMovement={10} />
        </div>
    )
}

export type BackgroundCanvasProps = CanvasProps

export function BackgroundCanvas(props: BackgroundCanvasProps): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!

        renderBackground(props.dimensions.world, props.dimensions, ctx)
    }, [])

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                style={{ position: 'absolute' }}
                ref={canvasRef}
                width={props.dimensions.totalWidth}
                height={props.dimensions.totalHeight}
            />
        </div>
    )
}

export interface DebugCanvasProps extends CanvasProps {
    origin: Coordinate | null
    availableMovement: number
}

export function DebugCanvas(props: DebugCanvasProps): JSX.Element {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current!
        const ctx = canvas.getContext('2d')!

        renderDebug(
            props.dimensions.world,
            props.dimensions,
            ctx,
            0,
            props.origin,
            props.availableMovement,
        )
    }, [props.origin])

    return (
        <div style={{ position: 'relative' }}>
            <canvas
                style={{ position: 'absolute' }}
                ref={canvasRef}
                width={props.dimensions.totalWidth}
                height={props.dimensions.totalHeight}
            />
        </div>
    )
}
