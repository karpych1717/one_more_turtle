const V_COEF = 0.002
const VA_COEF = 0.004

const turtle = {
  x: 0,
  y: 0,
  v: 20,
  angle: 0,
  va: 20,
  color: 'blue',
  pic: (() => {
    const pic = new Image()
    pic.src = 'black_box/turtle_sprite.png'
    return pic
  })(),
  tasks: [],
  currentTask: null,
  trace: true,
  draw: function (ctx) {
    ctx.clearRect(0, 0, 501, 501)

    ctx.translate( Math.round(this.x) + 251, - Math.round(this.y) + 251)
    ctx.rotate(-2 * Math.PI * (this.angle - 90) / 360)

    ctx.fillStyle = this.color
    ctx.fillRect(-3, -3, 7, 7)
    ctx.drawImage(this.pic, -11, -11)

    ctx.rotate(2 * Math.PI * (this.angle - 90) / 360)
    ctx.translate(- Math.round(this.x) - 251,  Math.round(this.y) - 251)
  },
  step: function (dt) {
    this.x += V_COEF * this.v * Math.cos(Math.PI * this.angle / 180) * dt
    this.y += V_COEF * this.v * Math.sin(Math.PI * this.angle / 180) * dt
  },
  tick: function (dt) {
    this.angle += VA_COEF * this.va * dt

    if (this.angle >= 360) this.angle -= 360
    if (this.angle < 0) this.angle += 360
  },
  evolve: function (dt) {
    if (this.currentTask === null) this.currentTask = this.tasks.shift() || null
    if (this.currentTask === null) return

    switch (this.currentTask.type) {
      case 'move':
        this.step(dt)
        break
      case 'rotate':
        this.tick(dt)
        break
    }

    this.currentTask.time -= dt
    if (this.currentTask.time <= 0) this.currentTask = null
  }
}

function forward (length) {
    const time = length / turtle.v / V_COEF

    turtle.tasks.push({type: 'move', time})
    console.log('forward pushed')
}

function left (angle = 90) {
    const time = angle / turtle.va / VA_COEF
    turtle.tasks.push({type: 'rotate', time, final: turtle.angle + angle})
}

function right (angle = 90) {
    const time = angle / turtle.va / VA_COEF
    turtle.tasks.push({type: 'rotate', time, final: turtle.angle - angle})
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