/* global crossPic liveCVS turtleLog */

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
    ctx.translate(this.x, this.y)
    ctx.rotate(this.time / PERIOD * 2 * Math.PI)

    ctx.drawImage(crossPic, -10.5, -10.5, 21, 21)

    ctx.rotate(-this.time / PERIOD * 2 * Math.PI)
    ctx.translate(-this.x, -this.y)
  }
}

function crossOnClick (event) {
  crosses.addCross(event.offsetX, event.offsetY)

  const virtualX = Math.round(event.offsetX - 251)
  const virtualY = Math.round(-event.offsetY + 251)
  turtleLog(`координати: (${virtualX}, ${virtualY})`)
}

liveCVS.addEventListener('pointerdown', crossOnClick)

console.log('5) crosses.js\tis ready')
