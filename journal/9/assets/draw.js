import Atrament from './atrament.js'

const canvas = document.querySelector( '#sketchpad' )
const sketchpad = new Atrament( canvas, {
  width: canvas.offsetWidth,
  height: canvas.offsetHeight,
} )

sketchpad.weight = 2
sketchpad.smoothing = 0
sketchpad.adaptiveStroke = false