var chalk = require("chalk")
var inquirer = require("inquirer")
var Enemy = require("./constructors/enemy")
var ClassList = require("./constructors/class-list")
var Guardian = ClassList.Guardian;
var Ranger = ClassList.Ranger;
var Arcanist = ClassList.Arcanist;

var bold = chalk.bold

var characters = []
var enemies = []
var classes = ["Guardian", "Ranger", "Arcanist"]
var races = ["Imperial", "Freefolk", "Wood Elf", "Dark Elf", "Lycan", "Voidwoken"]

var skeleton = new Enemy("Skeleton", 1, 2, 12, 4)
var bandit = new Enemy("Bandit", 3, 5, 25, 10)
var minotaur = new Enemy("Minotaur", 5, 12, 65, 35)
var vampire = new Enemy("Vampire", 8, 26, 180, 100)
var necromancer = new Enemy("Necromancer", 11, 36, 210, 225)
var golem = new Enemy("Golem", 14, 40, 500, 500)
var lich = new Enemy("Lich", 18, 55, 550, 999)
var lesserDemon = new Enemy("Lesser Demon", 26, 66, 666, 1666)

enemies.push(skeleton, bandit, minotaur, vampire, necromancer, golem, lich, lesserDemon)

var opponent
var player

function gameMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["Battle", "Shop", "Inventory", "Stats", "Return to Town"]
      }
    ])
    .then(function (res) {
      switch (res.action) {
        case "Battle":
          pickEnemy()
          // console.log("\n" + player.name + " vs " + opponent.name + "\n")
          console.log(bold("\n      ##########################################\n"))
          console.log(bold("              " + chalk.blue(player.name) + "     vs     " + chalk.red(opponent.name) + "       "))
          console.log(bold("\n      ##########################################\n"))
          makeMove(opponent, player)
          break;

        case "Stats":
          player.printStats()
          gameMenu()
          break;
        case "Return to Town":
          console.log("\nReturning to town.\n")
          mainMenu()
          break;

        default:
          console.log("Error in gameMenu")
          break;
      }
    })
}

function pickEnemy() {
  var enemyIndex
  if (player.lvl < 5) {
    enemyIndex = Math.floor(Math.random() * 2)
  } else if (player.lvl < 12) {
    enemyIndex = Math.floor(Math.random() * 3 + 2)
  } else {
    enemyIndex = Math.floor(Math.random() * 4 + 4)
  }
  opponent = enemies[enemyIndex]
  opponent.hp = opponent.maxHp
}

function makeMove(opponent, player) {
  inquirer
    .prompt({
      type: "list",
      name: "ability",
      message: "Choose an action: ",
      choices: function () {
        if (player.lvl < 5) {
          return [player.abilities[0], "Run"]
        } else {
          return [...player.abilities, "Run"]
        }
      }
    })
    .then(function (user) {
      if (user.ability === "Run") {
        console.log("\nFleeing from battle!\n")
        console.log("Level up and try again!\n")
        return gameMenu()
      }

      player.hp = opponent.attack(player)

      if (player.isAlive()) {
        opponent.hp = player.attack(user.ability, opponent)
      } else {
        var playerIndex = characters.indexOf(player)
        characters.splice(playerIndex, 1)
        console.log("May your soul find peace in the aether, " + player.name + "...\n")
        player = characters[0]
        return mainMenu()
      }

      if (opponent.isAlive()) {
        console.log("Next round!\n")
        makeMove(opponent, player)
      } else {
        console.log("Enemy defeated!\n")
        console.log("You gained " + opponent.xp + " XP!\n")
        player.gainXP(opponent.xp)
        gameMenu()
      }
    })
}

function createCharacter() {
  inquirer
    .prompt([
      {
        name: "name",
        message: "Name your character: "
      },
      {
        type: "list",
        name: "prof",
        message: "Choose your class: ",
        choices: classes
      },
      // {
      //   type: "list",
      //   name: "race",
      //   message: "Choose your race: ",
      //   choices: races
      // },
      // {
      //   name: "gender",
      //   message: "Choose your gender: ",
      //   default: "Unknown"
      // },
      // {
      //   type: "number",
      //   name: "age",
      //   message: "Choose your age: ",
      //   default: "Unknown"
      // },
      // Add area for char description
    ])
    .then(function (user) {
      checkClass(user)
    })
}

function checkClass(user) {
  var character;
  switch (user.prof) {
    case "Guardian":
      character = new Guardian(user)
      break;

    case "Ranger":
      character = new Ranger(user)
      break;

    case "Arcanist":
      character = new Arcanist(user)
      break;

    default:
      console.log("Error in checkClass!")
      break;
  }

  addCharacter(character)
}

function addCharacter(character) {
  characters.push(character)
  console.log("\n" + character.name + " added to characters!\n")
  console.log(character.name + " is now the active character.")
  player = characters[characters.length - 1]
  character.printStats()
  mainMenu()
}

function changeCharacter() {
  var charIndex = characters.indexOf(player)
  if (charIndex === (characters.length - 1)) {
    player = characters[0]
  } else {
    player = characters[charIndex + 1]
  }

  console.log("\nCharacter switched to: " + player.name + "\n")
  mainMenu()
}

function browseCharacters() {
  characters.forEach(function (character) {
    character.printStats()
  })

  mainMenu()
}

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "input",
        message: "Welcome traveler. Choose an option: ",
        choices: function () {
          if (characters.length > 0) {
            return ["Adventure", "Create Character", "Change Character", "Browse Characters", "Exit Game"]
          } else {
            return ["Create Character", "Exit Game"]
          }
        }
      }
    ])
    .then(function (res) {
      switch (res.input) {
        case "Adventure":
          if (characters.length > 0) {
            console.log(bold("\n      ##########################################"))
            console.log(bold("      ##                                      ##"))
            console.log(bold("      ##                                      ##"))
            console.log(bold("      ##          " + chalk.red("Entering the wilds") + "          ##"))
            console.log(bold("      ##                                      ##"))
            console.log(bold("      ##                                      ##"))
            console.log(bold("      ##            Tread lightly             ##"))
            console.log(bold("      ##                                      ##"))
            console.log(bold("      ##           Brave traveler...          ##"))
            console.log(bold("      ##                                      ##"))
            console.log(bold("      ##                                      ##"))
            console.log(bold("      ##########################################\n"))
            gameMenu()
          } else {
            console.log("\nNo characters available!\n")
            mainMenu()
          }
          break;

        case "Create Character":
          console.log("\nCreating character...\n")
          createCharacter()
          break;

        case "Change Character":
          changeCharacter()
          break;

        case "Browse Characters":
          browseCharacters()
          break;

        case "Exit Game":
          console.log("\nThe End... ?\n")
          break;

        default:
          console.log("\nError in the switch!\n")
          break;
      }
    })
}


console.log("\n")

console.log(bold("      ##########################################"))
console.log(bold("      ##                                      ##"))
console.log(bold("      ##                                      ##"))
console.log(bold("      ##          " + chalk.green("The Last Sanctum") + "            ##"))
console.log(bold("      ##                                      ##"))
console.log(bold("      ##                                      ##"))
console.log(bold("      ##          An Adventure RPG            ##"))
console.log(bold("      ##                                      ##"))
console.log(bold("      ##       Our world needs heroes...      ##"))
console.log(bold("      ##                                      ##"))
console.log(bold("      ##                                      ##"))
console.log(bold("      ##########################################"))

console.log("\n")

mainMenu()

/*

Different classes
-- Give different stats
-- Give different moves
-- Give different level up numbers



Game Features:
-- Pre-made classes w/ different abilities
-- Enemies w/ different moves
-- Inventory system (potions, poisions, etc.)
-- Equipment system (weapons, armour)
-- Zones w/ different enemies
-- Game menu has battles, shops, inv/equips, exit to main

-- Splash screens
  o Main menu
  o Start game w/ character info
  o Start battle w/ character and enemy info
  o Battle screen w/ different moves/items and description
  o End round screen
  o Inv, equips, shop
  o Zones



TODO:
-- Reset stats after each round
-- Reset stats after lvl up
-- Choose from enemy list
-- Choose from character list
-- Better combat math
-- More detailed characters

Browse fn:
-- Change into a "slideshow" type display w/ confirms switching between entries

*/