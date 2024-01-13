/* global berryPic turtle turtleLog */

const BERRY_SIZE_PERIOD = 2625
const BERRY_ROTATION_PERIOD = 5500

const berriesPreset = [
  { x: -100, y: 100 },
  { x: -100, y: -100 },
  { x: -200, y: -200 },
  { x: 200, y: -200 },
  { x: 200, y: 200 }
]

const quest = {
  berries: [],
  nearBerry: null,
  timer: 0,
  level: 0,
  pic: berryPic,
  setUp (_amount) {
    if (isNaN(_amount)) {
      throw (new Error('      level is NaN'))
    }
    if (_amount < 1) {
      throw (new Error('   level should be >= 1'))
    }
    if (_amount > 5) {
      throw (new Error('   level should be <= 5'))
    }
    if (Math.trunc(_amount) !== _amount) {
      throw (new Error('level is not an integer value'))
    }

    this.timer = 0
    this.level = _amount

    this.berries = berriesPreset.slice(0, _amount)

    for (const berry of this.berries) {
      berry.sizePhase = Math.random()
      berry.rotationPhase = Math.random()
    }

    if (Math.random() >= 0.5) {
      for (const berry of this.berries) {
        berry.x *= -1
      }
    }
  },

  evolve (dt) {
    if (this.berries.length === 0) return

    this.timer += dt

    for (const berry of this.berries) {
      berry.sizePhase += dt / BERRY_SIZE_PERIOD
      berry.rotationPhase += dt / BERRY_ROTATION_PERIOD

      if (berry.sizePhase > 1) berry.sizePhase = 0
      if (berry.rotationPhase > 1) berry.rotationPhase = 0
    }

    this.nearBerry = getNearBerry()

    if (this.nearBerry) {
      this.eatBerry(this.nearBerry)
    }
  },

  eatBerry (berryToEat) {
    this.berries = this.berries.filter(berry => berry !== berryToEat)
    this.nearBerry = null

    turtleLog('Смачно!')
    turtleLog('Часу минуло ' + Math.trunc(this.timer / 1000) + ' секунд.')

    if (this.berries.length === 0) {
      turtleLog(
        'Дякую! Остаточний результат за рівень ' +
        this.level +
        ' складає ' +
        Math.trunc(this.timer / 1000) +
        ' секунд.'
      )
    }
  },

  draw (ctx) {
    for (const berry of this.berries) {
      const halfWidth = 25 * this.sizePhaseMultiplier(berry.sizePhase)
      const halfHeight = 31.5 * this.sizePhaseMultiplier(berry.sizePhase)
      const angle = this.angleByPhase(berry.rotationPhase)

      ctx.translate(berry.x + 251, -berry.y + 251)
      ctx.rotate(angle)

      ctx.drawImage(
        this.pic,
        -halfWidth,
        -halfHeight,
        2 * halfWidth,
        2 * halfHeight
      )

      ctx.rotate(-angle)
      ctx.translate(-berry.x - 251, berry.y - 251)
    }
  },

  sizePhaseMultiplier (phase) {
    return 1 - 0.07 * (1 + Math.sin(2 * Math.PI * phase))
  },

  angleByPhase (phase) {
    return 0.15 * Math.PI * Math.sin(2 * Math.PI * phase)
  }

}

function startQuest (level = 1) {
  turtle.x = 0
  turtle.y = 0

  turtle.v = 20

  turtle.angle = 90
  turtle.va = 20

  turtle.tasks = []
  turtle.currentTask = null

  quest.setUp(level)
}

function stopQuest () {
  quest.berries = []
}

function getNearBerry () {
  if (quest.berries.length === 0) return

  for (const berry of quest.berries) {
    if (turtleDistanceTo(berry) <= 20) return berry
  }

  return null
}

function turtleDistanceTo (berry) {
  return Math.sqrt((turtle.x - berry.x) ** 2 + (turtle.y - berry.y) ** 2)
}

function questError () {
  if (quest.berries.length > 0) {
    throw (new Error('\n           no :)\n'))
  }
}

console.log('quest.js is ready')
