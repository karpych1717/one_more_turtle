/* global Image */

const DEFAULT_V = 20
const DEFAULT_VA = 20
const DEFAULT_COLOR = 'blue'

const V_COEF = 0.002
const VA_COEF = 0.007

const BERRY_SIZE_PERIOD = 2625
const BERRY_ROTATION_PERIOD = 5500

// the Cow sprite
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

// the Turtle
const turtle = {
  x: 0,
  y: 0,
  v: DEFAULT_V,
  vx: null,
  vy: null,
  angle: 90,
  va: DEFAULT_VA,
  color: DEFAULT_COLOR,
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
      case 'speedUp':
        if (this.currentTask.multiplicator === 'max') {
          this.v = 40_000
          this.va = 40_000
        }
        if (this.v < 20000) {
          this.v *= 2
          this.va *= 2
        }
        this.currentTask = null
        return
      case 'speedDown':
        if (this.currentTask.divider === 'min') {
          this.v = 2.5
          this.va = 2.5
        }
        if (this.v > 5) {
          this.v /= 2
          this.va /= 2
        }
        this.currentTask = null
        return
      case 'runFunction':
        this.currentTask.callback()
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

function runFunction(callback) {
  turtle.addTask({ type: 'runFunction', callback })
}

function theCow () {
  turtle.cow = !turtle.cow
}

// quest
const berriesPreset = [
  { x: -100, y: 100 },
  { x: -100, y: -100 },
  { x: -200, y: -200 },
  { x: 200, y: -200 },
  { x: 200, y: 200 }
]

const quest = {
  berries: [],
  time: 0,
  pic: (() => {
    const pic = new Image()
    pic.src = 'black_box/strawberry_sprite.png'
    return pic
  })(),

  setUp (_amount) {
    if (isNaN(_amount)) {
      throw (new Error('      level is NaN'))
    }
    if (_amount < 1) {
      throw (new Error('   level should be >= 1'))
    }
    if (_amount > 5) {
      throw (new Error('   level should be <= 5'))
    }
    if (Math.trunc(_amount) !== _amount) {
      throw (new Error('level is not an integer value'))
    }

    this.time = 0

    this.berries = berriesPreset.slice(0, _amount)

    for (const berry of this.berries) {
      berry.sizePhase = Math.random()
      berry.rotationPhase = Math.random()
    }

    if (Math.random() >= 0.5) {
      for (const berry of this.berries) {
        berry.x *= -1
      }
    }
  },

  evolve (dt) {
    if (this.berries.length === 0) return

    this.time += dt

    for (const berry of this.berries) {
      berry.sizePhase += dt / BERRY_SIZE_PERIOD
      berry.rotationPhase += dt / BERRY_ROTATION_PERIOD

      if (berry.sizePhase > 1) berry.sizePhase = 0
      if (berry.rotationPhase > 1) berry.rotationPhase = 0
    }
  },

  draw (ctx) {
    for (const berry of this.berries) {
      const halfWidth = 25 * this.sizePhaseMultiplier(berry.sizePhase)
      const halfHeight = 31.5 * this.sizePhaseMultiplier(berry.sizePhase)
      const angle = this.angleByPhase(berry.rotationPhase)

      ctx.translate(berry.x + 251, -berry.y + 251)
      ctx.rotate(angle)

      ctx.drawImage(
        this.pic,
        -halfWidth,
        -halfHeight,
        2 * halfWidth,
        2 * halfHeight
      )

      ctx.rotate(-angle)
      ctx.translate(-berry.x - 251, berry.y - 251)
    }
  },

  sizePhaseMultiplier (phase) {
    return 1 - 0.07 * (1 + Math.sin(2 * Math.PI * phase))
  },

  angleByPhase (phase) {
    return 0.15 * Math.PI * Math.sin(2 * Math.PI * phase)
  }

}

function theQuest (level = 1) {
  turtle.x = 0
  turtle.y = 0

  turtle.v = 20

  turtle.angle = 90
  turtle.va = 20

  quest.setUp(level)
}

function getNearBerry () {
  if (quest.berries.length === 0) return


}

function questError () {
  if (quest.berries.length > 0) {
    throw (new Error('\n           no :)\n'))
  }
}

// hacks
function speedUp (multiplicator) {
  questError()
  turtle.addTask({ type: 'speedUp', multiplicator })
}

function speedDown (divider) {
  questError()
  turtle.addTask({ type: 'speedDown', divider })
}

function goto (x, y) {
  questError()
  turtle.addTask({ type: 'goto', x, y })
}

// deprecated?
function getX () {
  return turtle.x
}

function getY () {
  return turtle.y
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

function turtleReset () {
  liveCTX.clearRect(0, 0, 501, 501)
  drawCTX.clearRect(0, 0, 501, 501)

  turtle.x = 0
  turtle.y = 0
  turtle.angle = 90

  turtle.v = DEFAULT_V
  turtle.va = DEFAULT_VA
  turtle.color = DEFAULT_COLOR
  turtle.width = 1
  turtle.trace = true

  turtle.tasks = []
  turtle.currentTask = null

  turtle.cow = false

  quest.berries = []
}

let dt
function render () {
  dt = timer()

  liveCTX.clearRect(0, 0, 501, 501)

  quest.draw(liveCTX)
  quest.evolve(dt)

  turtle.draw(liveCTX)
  turtle.evolve(dt)

  cow.evolve(dt)

  window.requestAnimationFrame(render)
}

turtle.pic.onload = render

console.log('turtle.js is ready')
