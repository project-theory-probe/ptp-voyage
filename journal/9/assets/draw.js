const main = document.querySelector( 'main' )
const footer = document.querySelector( 'footer' )
const canvas = document.querySelector( '#sketchpad' )
const context = canvas.getContext( '2d' )
const container = document.querySelector( '#sketchpadcontainer' )
const tools = document.querySelector( '#tools' )
const eraseBtn = document.querySelector( '#eraseBtn' )
const drawBtn = document.querySelector( '#drawBtn' )
const endBtn = document.querySelector( '#endBtn' )
const userspace = document.querySelector( '#userspace' )
const strokeArray = []
const canvasStore = document.createElement( 'img' )
const canvasStoreKey = 'issue9canvas'
let current = 0
let timer
let drawingflag = false
let drawmode = true
let toolsMode = false

document.onreadystatechange = () => {
  const loadCanvas = () => {
    if ( localStorage.getItem( canvasStoreKey ) !== null ) {
      canvasStore.src = localStorage.getItem( canvasStoreKey )
      canvasStore.onload = () => {
        context.drawImage( canvasStore, 0, 0 )
      }
    }
  }

  const setCanvasSize = () => {
    const targetWidth = document.documentElement.offsetWidth
    const targetHeight = footer.offsetTop + footer.offsetHeight

    container.style.height = targetHeight + 'px'
    container.style.width = targetWidth + 'px'

    if ( canvas.width < targetWidth || canvas.height < targetHeight ) {
      canvas.height = canvas.height > targetHeight ? canvas.height : targetHeight
      canvas.width = canvas.width > targetWidth ? canvas.width : targetWidth
      loadCanvas()
    }
  }

  if ( document.readyState === "complete" ) {

    setCanvasSize()

    drawBtn.onclick = () => {
      drawmode = true
      drawBtn.classList.add( 'active' )
      eraseBtn.classList.remove( 'active' )
    }

    eraseBtn.onclick = () => {
      drawmode = false
      drawBtn.classList.remove( 'active' )
      eraseBtn.classList.add( 'active' )
    }

    endBtn.onclick = () => {
      disableTools()
    }

    document.ontouchstart = ( event ) => {
      if ( toolsMode ) {
        startStroke()
        strokeArray.push( [event.changedTouches[0].pageX, event.changedTouches[0].pageY] )
        draw()
      } else {
        timer = setTimeout( () => {
          if ( window.getSelection().toString().length == 0 ) {
            enableTools()
            startStroke()
          }
          timer = null
        }, 500 )
      }
    }

    userspace.ontouchstart = ( event ) => {
      if ( toolsMode ) {
        startStroke()
        strokeArray.push( [event.changedTouches[0].pageX, event.changedTouches[0].pageY] )
        draw()
      } else {
        enableTools()
        startStroke()
      }
    }

    const handleTouchMove = ( event ) => {
      console.log( 'touchmove', event )
      if ( toolsMode && drawingflag ) {
        event.preventDefault()
        strokeArray.push( [event.changedTouches[0].pageX, event.changedTouches[0].pageY] )
        draw()
      }
    }

    document.addEventListener( 'touchmove', handleTouchMove, { passive: false } )

    document.ontouchend = () => {
      if ( toolsMode ) {
        endStroke()
      } else {
        cancelTimer()
      }
    }

    document.onmousedown = ( event ) => {
      if ( toolsMode ) {
        startStroke()
        strokeArray.push( [event.pageX, event.pageY] )
        draw()
      } else {
        timer = setTimeout( () => {
          if ( !window.getSelection().toString().length ) {
            enableTools()
            startStroke()
          }
          timer = null
        }, 500 )
      }
    }

    userspace.onmousedown = ( event ) => {
      if ( toolsMode ) {
        startStroke()
        strokeArray.push( [event.pageX, event.pageY] )
        draw()
      } else {
        enableTools()
        startStroke()
      }
    }

    document.onmousemove = ( event ) => {
      if ( toolsMode && drawingflag ) {
        strokeArray.push( [event.pageX, event.pageY] )
        draw()
      }
    }

    document.ondrag = () => {
      cancelTimer()
      endStroke()
    }

    document.onscroll = () => {
      cancelTimer()
    }

    document.onmouseup = () => {
      if ( toolsMode ) {
        endStroke()
      } else {
        cancelTimer()
      }
    }

    const enableTools = () => {
      toolsMode = true
      tools.classList.add( 'active' )
      canvas.classList.add( 'active' )
      main.classList.add( 'inactive' )
    }

    const disableTools = () => {
      toolsMode = false
      tools.classList.remove( 'active' )
      canvas.classList.remove( 'active' )
      main.classList.remove( 'inactive' )
    }

    const startStroke = () => {
      drawingflag = true
    }

    const endStroke = () => {
      strokeArray.length = 0
      current = 0
      drawingflag = false

      localStorage.setItem( canvasStoreKey, canvas.toDataURL() )
    }

    const cancelTimer = () => {
      if ( timer ) {
        clearTimeout( timer )
        timer = null
      }
    }

    const draw = () => {
      for ( let i = current; i < strokeArray.length - 1; i++ ) {
        context.beginPath()
        if ( drawmode ) {
          context.globalCompositeOperation = 'source-over'
          context.strokeStyle = 'black'
          context.lineWidth = 1
        } else {
          context.globalCompositeOperation = 'destination-out'
          context.lineWidth = 40
        }
        context.moveTo( strokeArray[i][0], strokeArray[i][1] )
        context.lineTo( strokeArray[i + 1][0], strokeArray[i + 1][1] )
        context.stroke()
        current = i
      }
    }

    window.onresize = () => {
      setCanvasSize()
    }
  }
}