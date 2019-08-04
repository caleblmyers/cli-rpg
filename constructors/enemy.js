function Enemy(name, lvl, str, hp, xp) {
  this.name = name
  this.lvl = lvl
  this.str = str
  this.hp = hp
  this.maxHp = hp
  this.xp = xp
}

Enemy.prototype.isAlive = function () {
  if (this.hp > 0) {
    console.log(this.name + " has " + this.hp + " HP remaining\n")
    return true
  } else {
    console.log(this.name + " is out of HP!\n")
    return false
  }
}

Enemy.prototype.attack = function (player) {
  return player.hp - this.str
}

module.exports = Enemy;