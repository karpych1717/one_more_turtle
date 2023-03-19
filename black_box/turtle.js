const V_COEF = 0.002
const VA_COEF = 0.004

const turtle = {
  x: 0,
  y: 0,
  v: 20,
  angle: 0,
  va: 20,
  color: 'blue',
  width: 15,
  trace: true,
  pic: (() => {
    const pic = new Image()
    pic.src = 'black_box/turtle_sprite.png'
    return pic
  })(),
  tasks: [],
  currentTask: null,
  draw: function (ctx) {
    ctx.clearRect(0, 0, 501, 501)

    if (this.trace) {
      ctx.fillStyle = this.color
      ctx.fillRect(Math.round(this.x) + 251 - 3, - Math.round(this.y) + 251 - 3, 7, 7)
    }

    ctx.translate( Math.round(this.x) + 251.5, - Math.round(this.y) + 251.5)
    ctx.rotate(-2 * Math.PI * (this.angle - 90) / 360)

    ctx.drawImage(this.pic, -11.5, -11.5)

    ctx.rotate(2 * Math.PI * (this.angle - 90) / 360)
    ctx.translate(- Math.round(this.x) - 251.5,  Math.round(this.y) - 251.5)
 
    
  },
  forwardStep: function (dt) {
    if (this.trace) {
      drawCTX.beginPath();
      drawCTX.moveTo(this.x + 251, -this.y + 251);

      this.x += V_COEF * this.v * Math.cos(Math.PI * this.angle / 180) * dt
      this.y += V_COEF * this.v * Math.sin(Math.PI * this.angle / 180) * dt

      drawCTX.lineTo(this.x + 251, -this.y + 251);
      drawCTX.lineWidth = this.width
      drawCTX.strokeStyle = this.color
      drawCTX.stroke();
    }
     
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
  evolve: function (dt) {
    if (this.currentTask === null) {
      this.currentTask = this.tasks.shift() || null
    }  else {
      if (this.currentTask.time <= 0) {
        if (this.currentTask.type === 'left' || this.currentTask.type === 'right') {
          this.angle = this.currentTask.final
        }
        this.currentTask = null
      }
    }
    if (this.currentTask === null) return

    switch (this.currentTask.type) {
      case 'forward':
        this.forwardStep(dt)
        break
      case 'left':
        this.leftStep(dt)
        break
      case 'right':
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
    const time = length / turtle.v / V_COEF

    turtle.addTask({type: 'forward', time})
}

function left (angle = 90) {
    const time = angle / turtle.va / VA_COEF
    turtle.addTask({type: 'left', time, final: turtle.angle + angle})
}

function right (angle = 90) {
    const time = angle / turtle.va / VA_COEF
    turtle.addTask({type: 'right', time, final: turtle.angle - angle})
}

function goto (x, y) {
  turtle.addTask({type: 'goto', x, y})
}

function penup () {
  turtle.addTask({type: 'penup'})
}

function pendown () {
  turtle.addTask({type: 'pendown'})
}

function angle (angle) {
  turtle.addTask({type: 'angle', angle})
}

function width (width) {
  turtle.addTask({type: 'width', width})
}

function color (color) {
  turtle.addTask({type: 'color', color})
}

function canvasSetUp (id, context, width, height) {
  const cvs = document.getElementById(id)
  const ctx = cvs.getContext(context)
  cvs.width = width
  cvs.height = height

  return {cvs, ctx}
}

const {cvs: liveCVS, ctx: liveCTX} = canvasSetUp('animation-canvas', '2d', 501, 501)
const {cvs: drawCVS, ctx: drawCTX} = canvasSetUp('draw-canvas', '2d', 501, 501)
// const {cvs: backCVS, ctx: backCTX} = canvasSetUp('back-canvas', '2d', 501, 501)

const timer = (function createTimer() {
  let prevTime = new Date().getTime()

  return function() {
    const currentTime = new Date().getTime()
    const elapsedMs = currentTime - prevTime
    prevTime = currentTime
    return elapsedMs < 40 ? elapsedMs : 40
  }
})()

function render () {
    turtle.draw(liveCTX)
    turtle.evolve(timer())

    window.requestAnimationFrame(render)
}

turtle.pic.onload = render

console.log('turtle.js is ready')