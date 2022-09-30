import './index.css'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Canvas, Control } from './framework'
import { game1 } from './game-1'
import { game2 } from './game-2'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const canvas = new Canvas(document.querySelector('#canvases')!)
const control = new Control(document)

// game1(canvas, control)
game2(canvas, control)
