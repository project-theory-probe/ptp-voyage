import Atrament from './atrament.js'
import { MODE_DRAW, MODE_ERASE } from './atrament.js'

const canvas = document.querySelector( '#sketchpad' )
const eraseBtn = document.querySelector( '#eraseBtn' )
const drawBtn = document.querySelector( '#drawBtn' )

const sketchpad = new Atrament( canvas, {
  width: canvas.offsetWidth,
  height: canvas.offsetHeight,
} )

eraseBtn.onclick = () => {
  sketchpad.mode = MODE_ERASE
  sketchpad.weight = 20
}

drawBtn.onclick = () => {
  sketchpad.mode = MODE_DRAW
  sketchpad.weight = 2
}

sketchpad.weight = 2
sketchpad.smoothing = 0
sketchpad.adaptiveStroke = false