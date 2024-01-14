/* global turtle questError logTheError
   consoleReset turtleReset questReset */

function reset () {
  consoleReset()
  turtleReset()
  questReset()
}

function getX () {
  return turtle.x
}

function getY () {
  return turtle.y
}

function speedUp (multiplicator) {
  questHackError(
    'speedUp() is not alowed',
    turtle.addTask,
    { type: 'speedUp', multiplicator }
  )
}

function speedDown (divider) {
  questHackError(
    'speedDown() is not alowed',
    turtle.addTask,
    { type: 'speedDown', divider }
  )
}

function goto (x, y) {
  questHackError(
    'goto()? O RLY?',
    turtle.addTask,
    { type: 'goto', x, y }
  )
}

function questHackError (message, callback, arg) {
  try {
    questError()
    callback.call(turtle, arg)
  } catch (error) {
    if (error.message === '\n           no :)\n') {
      logTheError(new Error(message))
    } else {
      logTheError(error)
    }
  }
}

console.log('6) hacks.js\t\tis ready')
