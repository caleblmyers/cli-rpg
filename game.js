var inquirer = require("inquirer")
var Enemy = require("./constructors/enemy")
var ClassList = require("./constructors/class-list")
var Guardian = ClassList.Guardian;
var Ranger = ClassList.Ranger;
var Arcanist = ClassList.Arcanist;

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
var activeEnemy = enemies[0]
var activeChar

function gameMenu() {
  var opponent = activeEnemy
  var player = activeChar

  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["Battle", "Shop", "Inventory", "Stats", "Main Menu"]
      }
    ])
    .then(function (res) {
      switch (res.action) {
        case "Battle":
          console.log("\n" + player.name + " vs " + opponent.name + "\n")
          makeMove(opponent, player)
          break;

        case "Stats":
          player.printStats()
          gameMenu()
          break;

        case "Main Menu":
          console.log("\nReturning to main menu. \n")
          mainMenu()
          break;

        default:
          console.log("Error in gameMenu")
          break;
      }
    })
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
        activeChar = characters[0]
        mainMenu()
      }

      if (opponent.isAlive()) {
        console.log("Next round!\n")
        makeMove(opponent, player)
      } else {
        console.log("Enemy defeated!\n")
        console.log("You gained " + opponent.xp + " XP!\n")
        player.gainXP(opponent.xp)
        opponent.hp = opponent.maxHp
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
      console.log("\nCharacter created!\n")
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
  console.log(character.name + " added to characters!\n")
  console.log(character.name + " is now the active character.\n")
  activeChar = characters[characters.length - 1]
  mainMenu()
}

function chooseCharacter() {
  if (characters.length > 0) {
    var charIndex = characters.indexOf(activeChar)
    if (charIndex === (characters.length - 1)) {
      activeChar = characters[0]
    } else {
      activeChar = characters[charIndex + 1]
    }
    console.log("\nCharacter switched to: " + activeChar.name + "\n")
  } else {
    console.log("\nNo characters available!\n")
  }
  mainMenu()
}

function chooseEnemy() {
  // Add lvl blocking feature
  var enemyIndex = enemies.indexOf(activeEnemy)
  if (enemyIndex === (enemies.length - 1)) {
    activeEnemy = enemies[0]
  } else {
    activeEnemy = enemies[enemyIndex + 1]
  }
  console.log("\nEnemy switched to: " + activeEnemy.name + "\n")
  mainMenu()
}

function browseCharacters() {
  if (characters.length > 0) {
    characters.forEach(function (character) {
      character.printStats()
    })
  } else {
    console.log("\nNo characters available!\n")
  }
  mainMenu()
}

function levelCharacter() {
  // Let fn take in a number for amount of levels
  if (characters.length > 0) {
    console.log("")
    console.log(activeChar.name, "has leveled up!\n")
    for (let i = 0; i < 50; i++) {
      activeChar.levelUp()
    }
  } else {
    console.log("\nNo characters available!\n")
  }
  mainMenu()
}

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "input",
        message: "Welcome! What would you like to do?",
        choices: ["Begin Game", "Choose Enemy", "Create Character", "Choose Character", "Browse Characters", "Level Character", "Exit Game"]
      }
    ])
    .then(function (res) {
      switch (res.input) {
        case "Begin Game":
          if (characters.length > 0) {
            console.log("\nGame begun with " + activeChar.name + "!\n")
            gameMenu()
          } else {
            console.log("\nNo characters available!\n")
            mainMenu()
          }
          break;

        case "Choose Enemy":
          chooseEnemy()
          break;

        case "Create Character":
          createCharacter()
          break;

        case "Choose Character":
          chooseCharacter()
          break;

        case "Browse Characters":
          browseCharacters()
          break;

        case "Level Character":
          levelCharacter()
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