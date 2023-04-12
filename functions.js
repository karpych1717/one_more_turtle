function circles () {
  for (let i = 0; i < 360; i++) {
    forward(1)
    right(1)
  }

  for (let i = 0; i < 360; i++) {
    forward(1)
    left(1)
  }

  left ()

  for (let i = 0; i < 360; i++) {
    forward (1)
    left (1)
  }

  for (let i = 0; i < 360; i++) {
    forward (1)
    right (1)
  }
}

console.log('function.js is ready')
