const main = document.querySelector( 'main' )
const userspace = document.querySelector( '#userspace' )
const touchsensor = document.querySelector( '#touchsensor' )
const canvas = document.querySelector( '#sketchpad' )
const context = canvas.getContext( '2d' )
const eraseBtn = document.querySelector( '#eraseBtn' )
const drawBtn = document.querySelector( '#drawBtn' )
const cachearray = []
let current = 0
let timer
let delaytimer
let drawingflag = false
let scroll
let drawmode = true

document.onreadystatechange = () => {
  if ( document.readyState === "complete" ) {
    setSize()

    drawBtn.onclick = () => {
      drawmode = true
    }

    eraseBtn.onclick = () => {
      drawmode = false
    }

    document.ontouchstart = ( event ) => {
      scroll = window.scrollY
      cachearray.push( [event.pageX, event.pageY] )
      clearTimeout( timer )
      timer = setTimeout( () => {
        draw()
      }, 400 )
      console.log( 'touchstart', drawingflag )
    }

    userspace.ontouchstart = ( event ) => {
      event.preventDefault()
      cachearray.push( [event.pageX, event.pageY] )
      draw()
    }

    main.ontouchmove = ( event ) => {
      if ( cachearray.length ) {
        cachearray.push( [event.pageX, event.pageY] )
      }

      if ( window.getSelection().type == 'Range' ) {
        reset()
      }

      if ( window.scrollY != scroll ) {
        reset()
      }

      if ( drawingflag ) {
        console.log( 'preventdefault' )
        event.preventDefault()
        draw()
        if ( !delaytimer ) {
          delaytimer = setTimeout( () => {
            reset()
          }, 500 )
        }
      }
    }

    document.ontouchend = () => {
      cachearray.length = 0
      current = 0
      console.log( 'touchend', drawingflag )
      if ( !delaytimer ) {
        delaytimer = setTimeout( () => {
          reset()
        }, 500 )
      }
    }

    document.onmousedown = ( event ) => {
      if ( !cachearray.length ) {
        cachearray.push( [event.pageX, event.pageY] )
        clearTimeout( timer )
        timer = setTimeout( () => {
          draw()
        }, 400 )
      }
    }

    userspace.onmousedown = ( event ) => {
      cachearray.push( [event.pageX, event.pageY] )
      draw()
    }

    document.onmousemove = ( event ) => {
      if ( cachearray.length ) {
        cachearray.push( [event.pageX, event.pageY] )
      }

      if ( window.getSelection().toString().length ) {
        reset()
      }

      if ( drawingflag ) {
        draw()
      }
    }

    document.ondrag = () => {
      reset()
    }

    document.onmouseup = () => {
      cachearray.length = 0
      current = 0
      if ( !delaytimer ) {
        delaytimer = setTimeout( () => {
          reset()
        }, 500 )
      }
    }

    const reset = () => {
      drawingflag = false
      cachearray.length = 0
      current = 0
      main.style.userSelect = 'auto'
      clearTimeout( timer )
      clearTimeout( delaytimer )
      timer = null
      delaytimer = null
      console.log( 'reset' )
    }

    const draw = () => {
      drawingflag = true
      clearTimeout( delaytimer )
      delaytimer = null
      main.style.userSelect = 'none'
      for ( let i = current; i < cachearray.length - 1; i++ ) {
        context.beginPath()
        if ( drawmode ) {
          context.globalCompositeOperation = 'source-over'
          context.strokeStyle = 'black'
          context.lineWidth = 1
        } else {
          context.globalCompositeOperation = 'destination-out'
          context.lineWidth = 40
        }
        context.moveTo( cachearray[i][0], cachearray[i][1] )
        context.lineTo( cachearray[i + 1][0], cachearray[i + 1][1] )
        context.stroke()
        current = i
      }
    }
  }
}

window.onresize = () => {
  setSize()
}

const setSize = () => {
  if ( canvas.height != document.documentElement.offsetHeight ) {
    canvas.width = document.documentElement.offsetWidth
    canvas.height = document.documentElement.offsetHeight

    touchsensor.style.width = document.documentElement.offsetWidth + 'px'
    touchsensor.style.height = document.documentElement.offsetHeight + 'px'
  }
} 
