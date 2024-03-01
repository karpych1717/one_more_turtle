/* global crossPic liveCVS turtleLog questError logTheError */

const TIMEOUT = 1000
const PERIOD = 1100

const crosses = {
  crosses: [],
  addCross (_x, _y) {
    this.crosses.push(new Cross(_x, _y))
  },
  removeCross (cross) {
    this.crosses = this.crosses.filter((element) => element !== cross)
  },
  evolve (dt) {
    for (const cross of this.crosses) {
      cross.time += dt
      if (cross.time > TIMEOUT) this.removeCross(cross)
    }
  },
  draw (ctx) {
    for (const cross of this.crosses) {
      cross.draw(ctx)
    }
  }
}

class Cross {
  x
  y
  time

  constructor (x, y) {
    this.x = x
    this.y = y
    this.time = 0
  }

  draw (ctx) {
    const phase = (this.time + 0.0005 * this.time ** 2) / PERIOD

    ctx.translate(this.x, this.y)
    ctx.rotate(phase * 2 * Math.PI)

    ctx.drawImage(crossPic, -10.5, -10.5, 21, 21)

    ctx.rotate(-phase * 2 * Math.PI)
    ctx.translate(-this.x, -this.y)
  }
}

function crossOnClick (event) {
  if (!isNaN(event.button) && event.button > 0) return

  try {
    questError()
    crosses.addCross(event.offsetX, event.offsetY)

    const virtualX = Math.round(event.offsetX - 251)
    const virtualY = Math.round(-event.offsetY + 251)

    turtleLog(`координати: (${virtualX}, ${virtualY})`)
  } catch (error) {
    logTheError(error)
  }
}

liveCVS.addEventListener('pointerdown', crossOnClick)

console.log('5) crosses.js\tis ready')
