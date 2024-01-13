/* global turtle questError */

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

function getX () {
  return turtle.x
}

function getY () {
  return turtle.y
}

console.log('6) hacks.js\t\tis ready')
