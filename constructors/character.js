function Character(user) {
  // Add method that changes based on prof
  this.name = user.name
  this.prof = user.prof
  this.race = user.race
  this.gender = user.gender
  this.age = user.age
  this.lvl = 1
  this.xp = 0
  this.toNext = 5
  this.str = 10
  this.def = 10
  this.hp = 30
  this.maxHp = 30
  this.abilities = ["Attack"]
  // this.inventory = []
}

Character.prototype.printStats = function () {
  console.log("\n=========================\n")
  console.log("Stats for " + this.name)
  console.log("Profession: " + this.prof)
  console.log("Race: " + this.race)
  console.log("Gender: " + this.gender)
  console.log("Age: " + this.age)
  console.log("Level: " + this.lvl)
  console.log("Experience: " + this.xp)
  console.log("XP Needed: " + (this.toNext - this.xp))
  console.log("Strength: " + this.str)
  console.log("Defence: " + this.def)
  console.log("Health Points: " + this.hp)
  console.log("\n=========================\n")
}

Character.prototype.isAlive = function () {
  if (this.hp > 0) {
    console.log("\nYou have", this.hp, "HP remaining\n")
    return true
  } else {
    console.log("")
    console.log("Oh dear...you seem to have died!")
    console.log("")
    console.log("It was a good attempt...for a mortal.")
    console.log("")
    return false
  }
}

Character.prototype.attack = function (enemyHP) {
  return enemyHP - this.str
}

Character.prototype.gainXP = function (xp) {
  this.xp += xp
  if (this.xp > this.toNext) {
    var xpOver = this.xp - this.toNext
    console.log(this.name + " has leveled up!\n")
    this.levelUp(xpOver)
    console.log(this.name + " is now level " + this.lvl + "!\n")
  }
}

Character.prototype.levelUp = function (xpOver) {
  this.lvl++
  this.xp = 0 + xpOver
  this.toNext += 10
  this.str += 5 + Math.floor(this.lvl / 3)
  this.maxHp += 25 + (5 * Math.floor(this.lvl / 3))
  this.hp = this.maxHp
}

module.exports = Character;