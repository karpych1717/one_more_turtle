/* global left, right, forward */
/* global goto, angle, width, color */
/* global penup, pendown, showGrid */

let task

document.getElementById('console-input').addEventListener('submit', function (event) {
  event.preventDefault()

  task = this.querySelector('.input').value.trim()

  if (task === '') return

  try {
    eval(task)
  } catch (error) {
    this.querySelector('.input').classList.add('red')
    console.error(error.message)
  }
})

document.getElementById('console-input').addEventListener('reset', function () {
  this.querySelector('.input').classList.remove('red')
})

document.querySelector('.input').addEventListener('input', function () {
  this.classList.remove('red')
})

console.log('console.js is ready')
