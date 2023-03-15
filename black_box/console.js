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
  
    try {
      switch (taskName) {
        case 'test':
          console.log(`test(${taskArgs})`)
          this.reset()
          break
        case 'showGrid':
          showGrid()
          this.reset()
          break
        case 'forward':
          forward(...taskArgs)
          this.reset()
          break
        case 'right':
          right(...taskArgs)
          this.reset()
          break
        case 'left':
          left(...taskArgs)
          this.reset()
          break
        case 'goto':
          goto(...taskArgs)
          this.reset()
          break
        case 'penup':
          penup()
          this.reset()
          break
        case 'pendown':
          pendown()
          this.reset()
          break
        case 'angle':
          angle(...args)
          this.reset()
          break
        case 'width':
          width(...args)
          this.reset()
          break
        case 'color':
          color(...args)
          this.reset()
          break
        default:
          console.log('eror 404')
          this.querySelector('.input').classList.add('red')
      } 
    } catch {
      console.log('something unexpected went wrong')
      this.querySelector('.input').classList.add('red')
    }
  })
  
  document.getElementById('console-input').addEventListener('reset', function (event) {
      this.classList.remove('red')
  })
  
  document.querySelector('.input').addEventListener('input', function (event) {
      this.classList.remove('red')
  })

  console.log('console.js is ready')