/* global runFunction turtleReset */

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

consoleReset()

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
    logTheError(error)
  }
}

function logTheError (error) {
  console.error(error.message)

  log('========= WARNING! =========')
  log(error.message)
  log('============================\n')
}

function log (text) {
  _textOutput.value += `${text}\n`
  _textOutput.scrollTop = _textOutput.scrollHeight
}

function turtleLog (text) {
  log(`the Turtle: '${text}'`)
}

function turtleHelp () {
  turtleLog('Список доступних команд')
  log('')

  log('  reset()\t\t- обнулити черепашку')
  log('')

  log('  startQuest()\t\t- запустити квест')
  log('  ⮩ startQuest(number)\t- запустити number рівень квесту')
  log('')

  log('  forward()\t\t- йти вперед на 30 кроків')
  log('  ⮩ forward(number)\t- йти вперед на number кроків')
  log('')

  log('  left()\t\t- повернути ліворуч на 90 градусів')
  log('  ⮩ left(number)\t- повернути ліворуч на number градусів')
  log('  right()\t\t- повернути праворуч на 90 градусів')
  log('  ⮩ right(number)\t- повернути праворуч на number градусів')
  log('')

  log('  goto(x, y)\t\t- телепортація на координати (x, y)')
  log('  angle(number)\t\t- встановити кут на angle градусів')
  log('')

  log('  width(number)\t\t- встановити товщину лінії number пікселів')
  log('  color(\'color\')\t- встановити колір color (англійською мовою)')
  log('')

  log('  penUp()\t\t- перестати малювати')
  log('  penDown()\t\t- почати малювати')
  log('')

  log('  say(\'text\')\t\t- вивести text в консоль')
  log('')

  log('  speedUp()\t\t- збільшити швидкість')
  log('  ⮩ speedUp(\'max\')\t- збільшити швидкість до максимуму')
  log('  speedDown()\t\t- зменшити швидкість')
  log('  ⮩ speedDown(\'min\')\t- зменшити швидкість до мінімуму')
  log('')

  log('  circles()\t\t- кола з файлу functions.js (якщо є)')
  log('  theCow()\t\t- увімкнути режим корівки')
  log('')
}

function say (text) {
  runFunction(() => turtleLog(text))
}

function help () {
  runFunction(() => turtleHelp())
}

function consoleReset () {
  _textOutput.value = 'Використайте команду help() щоб отримати список доступних команд.\n\n'
}

console.log('3) console.js\tis ready')
