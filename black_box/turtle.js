/* global Image */

const V_COEF = 0.002
const VA_COEF = 0.007

const cow = {
  pic: (() => {
    const pic = new Image()
    pic.src = 'black_box/cow_sprite.png'
    return pic
  })(),
  time: 0,
  period: 2000,
  frame: function () {
    const frame = Math.trunc(this.time / this.period * 20)
    return frame < 20 ? frame : 19
  },
  evolve: function (dt) {
    this.time += dt

    if (this.time >= this.period) this.time = 0
  },
  draw: function (ctx) {
    ctx.rotate(-Math.PI * 90 / 180)

    ctx.drawImage(this.pic, this.frame() * (51 + 2), 0, 51, 51, -25.5, -25.5, 51, 51)
    ctx.rotate(Math.PI * 90 / 180)
  }
}

const turtle = {
  x: 0,
  y: 0,
  v: 20,
  vx: 0,
  vy: 20,
  angle: 90,
  va: 20,
  color: 'blue',
  width: 1,
  trace: true,
  cow: false,
  pic: (() => {
    const pic = new Image()
    pic.src = 'black_box/turtle_sprite.png'
    return pic
  })(),
  tasks: [],
  currentTask: null,
  draw: function (ctx, dt) {
    ctx.clearRect(0, 0, 501, 501)

    if (this.trace) {
      ctx.fillStyle = this.color
      ctx.fillRect(Math.round(this.x) + 251 - 3, -Math.round(this.y) + 251 - 3, 7, 7)
    }

    ctx.translate(Math.round(this.x) + 251.5, -Math.round(this.y) + 251.5)
    ctx.rotate(-2 * Math.PI * (this.angle - 90) / 360)

    if (this.cow) {
      cow.draw(ctx, dt)
    } else {
      ctx.drawImage(this.pic, -11.5, -11.5)
    }

    ctx.rotate(2 * Math.PI * (this.angle - 90) / 360)
    ctx.translate(-Math.round(this.x) - 251.5, Math.round(this.y) - 251.5)
  },
  forwardStep: function (dt) {
    this.x += V_COEF * this.vx * dt
    this.y += V_COEF * this.vy * dt
  },
  leftStep: function (dt) {
    this.angle += VA_COEF * this.va * dt

    if (this.angle >= 360) this.angle -= 360
    if (this.angle < 0) this.angle += 360
  },
  rightStep: function (dt) {
    this.angle -= VA_COEF * this.va * dt

    if (this.angle >= 360) this.angle -= 360
    if (this.angle < 0) this.angle += 360
  },
  currentForwardTaskInit: function () {
    this.currentTask.toInit = false

    this.currentTask.time = this.currentTask.length / this.v / V_COEF

    if (this.angle === 0) {
      this.vx = this.v
      this.vy = 0
    } else if (this.angle === 90) {
      this.vx = 0
      this.vy = this.v
    } else if (this.angle === 180) {
      this.vx = -this.v
      this.vy = 0
    } else if (this.angle === 270) {
      this.vx = 0
      this.vy = -this.v
    } else {
      this.vx = this.v * Math.cos(Math.PI * this.angle / 180)
      this.vy = this.v * Math.sin(Math.PI * this.angle / 180)
    }

    this.currentTask.startX = this.x
    this.currentTask.startY = this.y

    this.currentTask.finalX = this.x + this.currentTask.length * Math.cos(Math.PI * this.angle / 180)
    this.currentTask.finalY = this.y + this.currentTask.length * Math.sin(Math.PI * this.angle / 180)
  },
  currentRotationTaskInit: function () {
    this.currentTask.toInit = false

    this.currentTask.time = this.currentTask.angle / this.va / VA_COEF

    if (this.currentTask.type === 'left') {
      this.currentTask.final = this.angle + this.currentTask.angle
    }
    if (this.currentTask.type === 'right') {
      this.currentTask.final = this.angle - this.currentTask.angle
    }
  },
  evolve: function (dt) {
    if (this.currentTask === null) {
      this.currentTask = this.tasks.shift() || null
    } else {
      if (this.currentTask.time <= 0) {
        if (this.currentTask.type === 'left' || this.currentTask.type === 'right') {
          this.angle = this.currentTask.final
        }
        if (this.currentTask.type === 'forward') {
          this.x = this.currentTask.finalX
          this.y = this.currentTask.finalY

          if (this.trace) {
            drawCTX.beginPath()
            drawCTX.moveTo(this.currentTask.startX + 251, -this.currentTask.startY + 251)
            drawCTX.lineTo(this.x + 251, -this.y + 251)
            drawCTX.lineCap = 'round'
            drawCTX.lineWidth = this.width
            drawCTX.strokeStyle = this.color
            drawCTX.stroke()
          }
        }
        this.currentTask = null
      }
    }
    if (this.currentTask === null) return

    switch (this.currentTask.type) {
      case 'forward':
        if (this.currentTask.toInit) this.currentForwardTaskInit()

        this.forwardStep(dt)

        if (this.trace) {
          liveCTX.beginPath()
          liveCTX.moveTo(this.currentTask.startX + 251, -this.currentTask.startY + 251)
          liveCTX.lineTo(this.x + 251, -this.y + 251)
          liveCTX.lineCap = 'round'
          liveCTX.lineWidth = this.width
          liveCTX.strokeStyle = this.color
          liveCTX.stroke()
        }
        break
      case 'left':
        if (this.currentTask.toInit) this.currentRotationTaskInit()
        this.leftStep(dt)
        break
      case 'right':
        if (this.currentTask.toInit) this.currentRotationTaskInit()
        this.rightStep(dt)
        break
      case 'goto':
        this.x = this.currentTask.x
        this.y = this.currentTask.y
        this.currentTask = null
        return
      case 'penup':
        this.trace = false
        this.currentTask = null
        return
      case 'pendown':
        this.trace = true
        this.currentTask = null
        return
      case 'angle':
        this.angle = this.currentTask.angle
        this.currentTask = null
        return
      case 'width':
        this.width = this.currentTask.width
        this.currentTask = null
        return
      case 'color':
        this.color = this.currentTask.color
        this.currentTask = null
        return
    }

    this.currentTask.time -= dt
  },
  addTask (task) {
    this.tasks.push(task)
  }
}

function forward (length = 30) {
  turtle.addTask({ type: 'forward', toInit: true, length })
}

function left (angle = 90) {
  turtle.addTask({ type: 'left', toInit: true, angle })
}

function right (angle = 90) {
  turtle.addTask({ type: 'right', toInit: true, angle })
}

function goto (x, y) {
  turtle.addTask({ type: 'goto', x, y })
}

function penup () {
  turtle.addTask({ type: 'penup' })
}

function pendown () {
  turtle.addTask({ type: 'pendown' })
}

function angle (angle) {
  turtle.addTask({ type: 'angle', angle })
}

function width (width) {
  turtle.addTask({ type: 'width', width })
}

function color (color) {
  turtle.addTask({ type: 'color', color })
}

function theCow () {
  turtle.cow = !turtle.cow
}

function canvasSetUp (id, context, width, height) {
  const cvs = document.getElementById(id)
  const ctx = cvs.getContext(context)
  cvs.width = width
  cvs.height = height

  return { cvs, ctx }
}

const { cvs: liveCVS, ctx: liveCTX } = canvasSetUp('animation-canvas', '2d', 501, 501)
const { cvs: drawCVS, ctx: drawCTX } = canvasSetUp('draw-canvas', '2d', 501, 501)
// const { cvs: backCVS, ctx: backCTX } = canvasSetUp('back-canvas', '2d', 501, 501)

const timer = (function createTimer () {
  let prevTime = new Date().getTime()

  return function () {
    const currentTime = new Date().getTime()
    const elapsedMs = currentTime - prevTime
    prevTime = currentTime
    return elapsedMs < 40 ? elapsedMs : 40
  }
})()

let dt
function render () {
  dt = timer()

  turtle.draw(liveCTX)
  turtle.evolve(dt)

  cow.evolve(dt)

  window.requestAnimationFrame(render)
}

turtle.pic.onload = render

console.log('turtle.js is ready')
