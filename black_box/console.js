/* global runFunction */
const _consoleInput = document.getElementById('console-input')
const _textInput = _consoleInput.querySelector('.text-input')
const _textOutput = document.getElementById('console-output')

_consoleInput.addEventListener('submit', handleInput)

_consoleInput.addEventListener('reset', function () {
  _textInput.classList.remove('red')
})

_textInput.addEventListener('input', function () {
  this.classList.remove('red')
})

console.log('console.js is ready')

function handleInput (event) {
  event.preventDefault()

  const task = _textInput.value.trim()

  if (task === '') {
    help()
    return
  }

  try {
    eval(task)
  } catch (error) {
    _textInput.classList.add('red')
    console.error(error.message)

    log('========= WARNING! =========')
    log(error.message)
    log('============================\n')
  }
}

function log (text) {
  _textOutput.value += `${text}\n`
  _textOutput.scrollTop = _textOutput.scrollHeight
}

function turtleLog (text) {
  log(`the Turtle: '${text}'`)
}

function turtleHelp () {
  turtleLog('The list of available commands')
  log('')

  log('  theQuest()')
  log('  ⮩ theQuest(number)')
  log('')

  log('  forward()')
  log('  ⮩ forward(number)')
  log('  left()')
  log('  ⮩ left(number)')
  log('  right()')
  log('  ⮩ right(number)')
  log('')

  log('  goto(x, y)')
  log('  angle(number)')
  log('')

  log('  width(number)')
  log('  color(\'color\')')
  log('')

  log('  penup()')
  log('  pendown()')
  log('')

  log('  say(\'text\')')
  log('')

  log('  speedUp()')
  log('  ⮩ speedUp(\'max\')')
  log('  speedDown()')
  log('  ⮩ speedDown(\'min\')')
  log('')

  log('  circles()')
  log('  theCow()')
  log('')
}

function say (text) {
  runFunction(() => turtleLog(text))
}

function help () {
  runFunction(() => turtleHelp())
}
