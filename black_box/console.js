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

  if (task === '') return

  try {
    eval(task)
  } catch (error) {
    this.querySelector('.input').classList.add('red')
    console.error(error.message)
  }
}

function log (text) {
  _textOutput.value += `${text}\n`
  _textOutput.scrollTop = _textOutput.scrollHeight
}

function say (text) {
  log(`the Turtle: '${text}'`)
}
