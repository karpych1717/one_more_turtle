const V_COEF = 0.002
const VA_COEF = 0.004

const turtle = {
  x: 0,
  y: 0,
  v: 20,
  angle: 90,
  va: 20,
  color: 'blue',
  width: 1,
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

    ctx.translate( Math.round(this.x) + 251, - Math.round(this.y) + 251)
    ctx.rotate(-2 * Math.PI * (this.angle - 90) / 360)

    if (this.trace) {
      ctx.fillStyle = this.color
      ctx.fillRect(-3, -3, 7, 7)
    }
    
    ctx.drawImage(this.pic, -11, -11)

    ctx.rotate(2 * Math.PI * (this.angle - 90) / 360)
    ctx.translate(- Math.round(this.x) - 251,  Math.round(this.y) - 251)
  },
  forwardStep: function (dt) {
    this.x += V_COEF * this.v * Math.cos(Math.PI * this.angle / 180) * dt
    this.y += V_COEF * this.v * Math.sin(Math.PI * this.angle / 180) * dt
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
      if (this.currentTask.time <= 0) this.currentTask = null
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
    turtle.addTask({type: 'left', time})
}

function right (angle = 90) {
    const time = angle / turtle.va / VA_COEF
    turtle.addTask({type: 'right', time})
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

const liveCVS = document.getElementById('animation-canvas')
const liveCTX = liveCVS.getContext('2d')
liveCVS.width = 501
liveCVS.height = 501

turtle.pic.onload = () => turtle.draw(liveCTX)

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

render()

console.log('turtle.js is ready')