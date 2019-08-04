var Character = require("./character")

function Guardian (user) {
  Character.call(this, user)

  this.hp = 100
  this.maxHp = 100
  this.abilities.push("Shield Bash")
}

Guardian.prototype = Object.create(Character.prototype)

Object.defineProperty(Guardian.prototype, 'constructor', {
  value: Guardian,
  enumerable: false,
  writable: true
})

Guardian.prototype.attack = function (ability, opponent) {
  if (ability === "Attack") {
    return opponent.hp - this.str
  } else if (ability === "Shield Bash") {
    return opponent.hp - (this.str - (-2))
  }
}

function Ranger (user) {
  Character.call(this, user)

  this.str = 100
}

Ranger.prototype = Object.create(Character.prototype)

Object.defineProperty(Ranger.prototype, 'constructor', {
  value: Ranger,
  enumerable: false,
  writable: true
})

function Arcanist (user) {
  Character.call(this, user)

  this.def = 100
}

Arcanist.prototype = Object.create(Character.prototype)

Object.defineProperty(Arcanist.prototype, 'constructor', {
  value: Arcanist,
  enumerable: false,
  writable: true
})

module.exports = {
  Guardian: Guardian,
  Ranger: Ranger,
  Arcanist: Arcanist
}