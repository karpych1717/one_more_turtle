document.getElementById('console-input').addEventListener('submit', function (event) {
    event.preventDefault()

    inputEror = (text) => {
      console.log(text)
      this.querySelector('.input').classList.add('red')
    }
  
    let task = this.querySelector('.input').value.trim()
  
    if (task === '') return

    if (!task.includes('(') || !task.includes(')')) {
      inputEror('eror (404)')
      return
    }

    if (task.indexOf('(') > task.indexOf(')')) {
      inputEror('eror )404(')
      return
    }
  
    let taskName = task.substring(0, task.indexOf('('))
    let taskArgs = task.slice(task.indexOf('(') + 1, task.indexOf(')'))

    taskArgs = taskArgs.split(',').map( part => part.trim() )

    if (taskArgs.length === 1 && taskArgs[0] === '') taskArgs = []

    console.log(taskName, taskArgs)

    try {
      switch (taskName) {
        case 'showGrid':
          showGrid()
          this.reset()
          break
        case 'forward':
          if (taskArgs.length === 0) {
            forward()
          }
          if (taskArgs.length === 1) {
            if(isNaN(taskArgs[0])) {
              inputEror('distance is not a number')
              return
            }
            forward(+taskArgs[0])
          }
          if (taskArgs.length > 1) {
            inputEror('extra args')
            return
          }

          this.reset()
          break
        case 'right':
          if (taskArgs.length === 0) {
            right()
          }
          if (taskArgs.length === 1) {
            if (isNaN(taskArgs[0])) {
              inputEror('angle is not a number')
              return
            }

            right(+taskArgs[0])
          }
          if (taskArgs.length > 1) {
            inputEror('extra args')
            return
          }

          this.reset()
          break
        case 'left':
          if (taskArgs.length === 0) {
            left()
          }
          if (taskArgs.length === 1) {
            if (isNaN(taskArgs[0])) {
              inputEror('angle is not a number')
              return
            }

            left(+taskArgs[0])
          }
          if (taskArgs.length > 1) {
            inputEror('extra args')
            return
          }

          this.reset()
          break
        case 'goto':
          if (taskArgs.length > 2) {
            inputEror('extra args')
            return
          }
          if (isNaN(taskArgs[0]) || isNaN(taskArgs[1])) {
            inputEror('coords is not a number')
            return
          }
          goto(+taskArgs[0], +taskArgs[1])
          this.reset()
          break
        case 'penup':
          if (taskArgs.length > 0) {
            inputEror('extra args')
            return
          }
          penup()
          this.reset()
          break
        case 'pendown':
          if (taskArgs.length > 0) {
            inputEror('extra args')
            return
          }
          pendown()
          this.reset()
          break
        case 'angle':
          if (taskArgs.length > 0 && taskArgs.length > 1) {
            inputEror('extra args')
            return
          }
          if (isNaN(taskArgs[0])) {
            inputEror('angle is not a number')
            return
          }

          angle(+taskArgs[0])
          this.reset()
          break
        case 'width':
          if (taskArgs.length > 0 && taskArgs.length > 1) {
            inputEror('extra args')
            return
          }
          if (isNaN(taskArgs[0])) {
            inputEror('width is not a number')
            return
          }

          width(+taskArgs[0])
          this.reset()
          break
        case 'color':
          if (taskArgs.length > 1) {
            inputEror('extra args')
            return
          }
          if (!taskArgs[0].startsWith(`'`) || !taskArgs[0].endsWith(`'`) || taskArgs[0].length <= 3) {
            inputEror('wrong string')
            return
          }

          color(taskArgs[0].replaceAll(`'`, ``))
          this.reset()
          break
        default:
          inputEror('eror 404')
      } 
    } catch (error) {
      inputEror('something unexpected went wrong')
      // console.error(error)
    }
  })
  
  document.getElementById('console-input').addEventListener('reset', function (event) {
    this.querySelector('.input').classList.remove('red')
  })
  
  document.querySelector('.input').addEventListener('input', function (event) {
    this.classList.remove('red')
  })

  console.log('console.js is ready')