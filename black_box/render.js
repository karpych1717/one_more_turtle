/* global liveCTX turtle quest crosses */

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

  liveCTX.clearRect(0, 0, 501, 501)

  quest.draw(liveCTX)
  quest.evolve(dt)

  crosses.draw(liveCTX)
  crosses.evolve(dt)

  turtle.draw(liveCTX)
  turtle.evolve(dt)

  window.requestAnimationFrame(render)
}

turtle.pic.onload = render

console.log('7) render.js\tis ready')
console.log('========================')
