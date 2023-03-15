document.getElementById('console-input').addEventListener('submit', function (event) {
  event.preventDefault()

  const task = this.querySelector('.input').value

  if (task.trim() === '') return

  let taskName = ''
  let taskArgs = ''
  let i = 0
  for ( ; i < task.length; i++) {
    if (task.charAt(i) === '(') break
    taskName += task.charAt(i)
  }
  
  i++
  for ( ; i < task.length; i++) {
    if (task.charAt(i) === ')') break
    taskArgs += task.charAt(i)
  }
  taskArgs = taskArgs.split(',').map( part => part.trim() )

  console.log(taskName, taskArgs)

  switch (taskName) {
    case '':
        console.log(`uwu (${taskArgs})`)
        this.reset()
        break
    default:
        console.log('def')
        this.querySelector('.input').classList.add('red')
  }
})

document.getElementById('console-input').addEventListener('reset', function (event) {
    this.classList.remove('red')
})

document.querySelector('.input').addEventListener('input', function (event) {
    this.classList.remove('red')
})