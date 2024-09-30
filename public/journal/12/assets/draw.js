const main = document.querySelector( 'main' )
const html = document.querySelector( 'html' )
const footer = document.querySelector( 'footer' )
const canvas = document.querySelector( '#sketchpad' )
const context = canvas.getContext( '2d' )
const container = document.querySelector( '#sketchpadcontainer' )
const tools = document.querySelector( '#tools' )
const eraseBtn = document.querySelector( '#eraseBtn' )
const drawBtn = document.querySelector( '#drawBtn' )
const endBtn = document.querySelector( '#endBtn' )
const startBtn = document.querySelector( '#startBtn' )
const strokeArray = []
const canvasStore = document.createElement( 'img' )
const canvasStoreKey = 'issue12canvas'
const bubble = document.createElement( 'div' )
let current = 0
let timer
let selectionTimer
let drawingflag = false
let drawmode = true
let toolsMode = false
let milisecond

document.onselectionchange = ( event ) => {
  console.dir( milisecond - Date.now() )
}

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

  bubble.classList.add( 'bubble' )
  main.appendChild( bubble )

  if ( document.readyState === "complete" ) {

    setCanvasSize()

    const switchToDraw = () => {
      drawmode = true
      drawBtn.classList.add( 'active' )
      eraseBtn.classList.remove( 'active' )
    }

    const switchToEraser = () => {
      drawmode = false
      drawBtn.classList.remove( 'active' )
      eraseBtn.classList.add( 'active' )
    }

    drawBtn.onclick = () => {
      switchToDraw()
    }

    drawBtn.ontouchstart = ( event ) => {
      event.preventDefault()
      switchToDraw()
    }

    eraseBtn.onclick = () => {
      switchToEraser()
    }

    eraseBtn.ontouchstart = ( event ) => {
      event.preventDefault()
      switchToEraser()
    }

    endBtn.onclick = () => {
      disableTools()
    }

    endBtn.ontouchstart = ( event ) => {
      event.preventDefault()
      disableTools()
    }

    startBtn.onclick = () => {
      enableTools()
    }

    startBtn.ontouchstart = ( event ) => {
      event.preventDefault()
      enableTools()
    }

    const updateBubblePos = ( event ) => {
      if ( event.pageY ) {
        bubble.style.top = event.pageY + 'px'
        bubble.style.left = event.pageX + 'px'
      } else {
        bubble.style.top = event.changedTouches[0].pageY + 'px'
        bubble.style.left = event.changedTouches[0].pageX + 'px'
      }
    }

    document.ontouchstart = ( event ) => {
      milisecond = Date.now()

      if ( event.touches.length > 1 ) {
        disableTools()
        cancelTimer()
        return
      }

      if ( toolsMode ) {
        startStroke()
        strokeArray.push( [event.changedTouches[0].pageX, event.changedTouches[0].pageY] )
        draw()
      } else {
        updateBubblePos( event )
        bubble.classList.add( 'large' )
        selectionTimer = setTimeout( () => {
          //document.getSelection().removeAllRanges()
          //html.style.webkitUserSelect = 'none'
        }, 400 )
        timer = setTimeout( () => {
          html.blur()
          if ( document.getSelection().toString().length == 0 ) {
            enableTools()
            startStroke()
          } else {
            cancelTimer()
          }
          timer = null
        }, 600 )
      }
    }

    const handleTouchMove = ( event ) => {
      if ( event.touches.length > 1 ) {
        disableTools()
        cancelTimer()
        return
      }

      if ( toolsMode && drawingflag ) {
        event.preventDefault()
        strokeArray.push( [event.changedTouches[0].pageX, event.changedTouches[0].pageY] )
        draw()
      }

      if ( !toolsMode ) {
        updateBubblePos( event )
      }

      if ( document.getSelection().toString().length > 0 ) {
        cancelTimer()
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
        updateBubblePos( event )
        bubble.classList.add( 'large' )
        timer = setTimeout( () => {
          if ( !document.getSelection().toString().length ) {
            enableTools()
            startStroke()
          } else {
            cancelTimer()
          }
          timer = null
        }, 1000 )
      }
    }

    document.onmousemove = ( event ) => {
      if ( toolsMode && drawingflag ) {
        strokeArray.push( [event.pageX, event.pageY] )
        draw()
      }

      if ( !toolsMode ) {
        updateBubblePos( event )
      }

      if ( document.getSelection().toString().length > 0 ) {
        cancelTimer()
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
      switchToDraw()
      tools.classList.add( 'active' )
      canvas.classList.add( 'active' )
      main.classList.add( 'inactive' )
      bubble.classList.add( 'inactive' )
      bubble.classList.remove( 'large' )
      startBtn.classList.add( 'inactive' )
    }

    const disableTools = () => {
      toolsMode = false
      tools.classList.remove( 'active' )
      canvas.classList.remove( 'active' )
      main.classList.remove( 'inactive' )
      bubble.classList.remove( 'inactive' )
      startBtn.classList.remove( 'inactive' )
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
      if ( selectionTimer ) {
        clearTimeout( selectionTimer )
        selectionTimer = null
      }
      bubble.classList.remove( 'large' )
      main.classList.remove( 'inactive' )
      html.style.webkitUserSelect = 'auto'
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