import { Room, Client } from 'colyseus'
import { ArraySchema } from '@colyseus/schema'
import { Product, Imgs, Products } from './schema/MyRoomState'
import {
  MainState,
  GameSettings,
  GameState,
  PlayerState
} from './schema/GameState'
import ProductModel from '../DB/models/product'
import MetaStats from '../DB/models/metaStats'
import { getAvatar } from '../utils/getAvatar'
import { getName } from '../utils/nameDE'

// 🛠 WIP 🛠: Get 10 random DB entries
// This 10 entries are in row - so there will be the same products in a row
const getProducts = async (productCount: number) => {
  const products = await ProductModel.aggregate([
    {
      $sample: { size: productCount }
    },
    {
      $project: {
        _id: 0,
        __v: 0
      }
    }
  ])

  // TODO: There is a way to change this in the query, I just currently can't remember how 😶
  const newProducts = products.map((product) => {
    const newProduct = { ...product }
    newProduct.creationDate = newProduct.creationDate.getTime()
    return newProduct
  })

  return newProducts
}

const updateMetaStats = async (type: string) => {
  // Only update if in production
  if (process.env.PRODUCTION === 'false') return

  // Get current Stats
  const stats = await (<any>MetaStats.findOne())

  if (type === 'gameStarted') {
    // Update states on DB
    stats.gamesStarted++
  }

  if (type === 'gameEnded') {
    // Update states on DB
    stats.gamesEnded++
  }

  await MetaStats.findOneAndUpdate(undefined, stats)
}

export class MyRoom extends Room {
  isAdmin = (id: string) => {
    const player = this.state.gameState.playerStates.filter(
      (player: PlayerState) => player.id === id
    )

    return player.admin
  }

  // Calculate player score
  getScore = (productPrice = 0, playerGuessedPrice = 0) => {
    let difference = productPrice - playerGuessedPrice
    if (difference < 0) difference = difference * -1
    if (difference > productPrice) return 0
    // percentage to the actual price
    const percentage = parseFloat(
      ((100 / productPrice) * difference).toFixed(2)
    )
    // create score
    return Math.floor((100 - percentage) * 10)
  }

  getAvgPrecision = (roundScores: [number]) => {
    // Convert roundScores into percentages
    const percentages = roundScores.map((score) => score / 1000)

    const avgPrecision =
      percentages.reduce((prev: any, current: any) => {
        return prev + current
      }, 0) / percentages.length

    return parseFloat(avgPrecision.toFixed(2))
  }

  // Get product from products state
  getProduct(products: Array<Product>, currentRound: number) {
    return products[currentRound]
  }

  updateDummies() {
    const playerCount = this.state.gameState.playerCount
    const dummyCount = this.state.gameState.playerStates.filter(
      (player: any) => player.id === 'dummy'
    ).length
    const maxPlayers = this.state.gameState.gameSettings.maxPlayers

    // Calculate the amount of dummies to remove / add
    const dummyValue = maxPlayers - playerCount - dummyCount

    if (dummyValue > 0) {
      // add dummies to the playerStates
      for (let i = 0; i < dummyValue; i++) {
        this.state.gameState.playerStates.push(new PlayerState())
      }
    } else if (dummyValue < 0) {
      // remove dummies from the playerStates
      let positiveDummyValue = dummyValue * -1

      this.state.gameState.playerStates = this.state.gameState.playerStates.reduce(
        (acc: any, curr: any) => {
          if (curr.id === 'dummy' && positiveDummyValue > 0) {
            positiveDummyValue--
            return acc
          } else {
            acc.push(curr)
            return acc
          }
        },
        new ArraySchema()
      )
    } else {
      // do nothing
      return
    }
  }

  removePlayer(index: number) {
    // if left player was admin - promote other player
    if (
      this.state.gameState.playerStates[index].admin &&
      this.state.gameState.playerStates[1]
    ) {
      this.state.gameState.playerStates[1].admin = true
    }

    // remove player from state
    this.state.gameState.playerStates.splice(index, 1)

    // Update playerCount
    this.state.gameState.playerCount--

    // check if in Lobby
    if (!this.state.gameState.gameStarted) {
      // Update Dummies
      this.updateDummies()
    }
  }

  handleRandomNameChange(client: any, players: Array<PlayerState>) {
    // Get the index of the player
    const index = players.findIndex((e: any) => e.id === client.sessionId)

    // New random player name
    players[index].name = getName(client.sessionId)
  }

  handleNameChange(client: any, newName: string, players: Array<PlayerState>) {
    // Get the index of the player
    const index = players.findIndex((e: any) => e.id === client.sessionId)

    players[index].name = newName
  }

  handleAvatarChange(client: any, players: Array<PlayerState>) {
    // Get the index of the player
    const index = players.findIndex((e: any) => e.id === client.sessionId)

    // Get him a new random avatar
    players[index].avatar = getAvatar(players[index].id)
  }

  handleMaxPlayersChange(client: any, playerCount: number, maxPlayers: number) {
    // Check if more players are connected then the maxPlayer setting should be
    if (playerCount > maxPlayers) {
      // send error message --> playerCount is higher then maxPlayers
      client.send('error', {
        type: 'critical',
        message: 'Sorry - es sind schon mehr Spieler in der Lobby.'
      })
      return
    }

    // Add / remove dummies in playerState
    this.updateDummies()
  }

  handleSettings(client: any, message: any, gameSettings: Array<GameSettings>) {
    // Check what setting is changing
    const settingName: any = Object.keys(message)[0]

    // TODO: Add some validation?!

    // Change setting
    gameSettings[settingName] = message[settingName]

    // Handle maxPlayers change add/remove dummies from PlayerStates
    if (settingName === 'maxPlayers') {
      this.handleMaxPlayersChange(
        client,
        this.state.gameState.playerCount,
        this.state.gameState.gameSettings.maxPlayers
      )
    }
  }

  handlePlayerGuess(client: any, message: any, players: Array<PlayerState>) {
    // Get the index of the player that guessed the price
    const index = players.findIndex((e: any) => e.id === client.sessionId)

    // Update guessedPrice in player state
    players[index].guessedPrice = message.guessedPrice

    // Get players that didn't guessed yet
    const playersNotGuessed = players.filter((e: any) => {
      return e.guessedPrice === 0
    })

    // Check if all players guessed a price
    if (playersNotGuessed.length === 0) {
      return true
    } else {
      return false
    }
  }

  startGame(gameSettings: GameSettings) {
    // Remove all dummies from playerStores
    this.state.gameState.playerStates = this.state.gameState.playerStates.filter(
      (player: any) => player.id !== 'dummy'
    )

    // Load 10 products into products state
    ;(async () => {
      const products = (await getProducts(gameSettings.rounds)).map(
        (product: any) =>
          new Product(
            (product as any).creationDate,
            (product as any).link,
            (product as any).searchterm,
            (product as any).title,
            (product as any).price,
            (product as any).ratingStars,
            (product as any).ratingCount,
            (product as any).featureBullets,
            (product as any).technicalDetails,
            (product as any).description,
            new Imgs(
              (product as any).imgs[0].mediumImgs,
              (product as any).imgs[0].largeImgs
            )
          )
      )

      this.state.gameState.products = products

      // Grab one product and set it to currentProduct
      this.state.gameState.currentProduct = this.state.gameState.products.$items.get(
        0
      )

      this.state.gameState.isProductsLoaded = true

      // Update betweenRoundsTime based on playerCount
      if (
        this.state.gameState.playerCount >= 2 &&
        this.state.gameState.playerCount <= 4
      ) {
        this.state.gameState.gameSettings.betweenRoundsTime = 10
      } else if (
        this.state.gameState.playerCount >= 5 &&
        this.state.gameState.playerCount <= 9
      ) {
        this.state.gameState.gameSettings.betweenRoundsTime = 15
      } else if (this.state.gameState.playerCount >= 10) {
        this.state.gameState.gameSettings.betweenRoundsTime = 20
      }
    })()

    // Update meta stats
    updateMetaStats('gameStarted')
  }

  restartGame() {
    const savedPlayerStates = this.state.gameState.playerStates.map(
      (player: PlayerState) => {
        return new PlayerState(
          player.id,
          player.name,
          player.avatar,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          player.admin
        )
      }
    )

    // this.setState(
    //   new GameState(this.state.gameState.gameSettings, savedPlayerStates)
    // )

    this.state.gameState = new GameState(
      this.state.gameState.gameSettings,
      savedPlayerStates,
      this.state.gameState.playerCount
    )

    // Used to set currentRoom on frontend
    this.state.gameState.isGameRestarted = true

    this.clock.setTimeout(() => {
      // Reset it back to false, so player can go to character creation
      this.state.gameState.isGameRestarted = false
    }, 100)
  }

  // Start the round
  startRound() {
    // Reset round state
    this.state.gameState.roundEnded = false
    this.state.gameState.isRoundScoreCalculated = false
    this.state.gameState.isBetweenRounds = false
    this.state.gameState.allPlayerGuessed = false
    this.state.gameState.isAllPlayerGuessed = false

    // Update currentRound state
    this.state.gameState.currentRound++

    // Reset player guessedPrice
    this.state.gameState.playerStates.forEach((player: any) => {
      player.guessedPrice = 0
      player.roundScore = 0
    })

    // Set new currentProduct
    this.state.gameState.currentProduct = this.getProduct(
      this.state.gameState.products,
      this.state.gameState.currentRound
    )
  }

  endRound(players: Array<PlayerState>) {
    // Calculate player scores
    if (!this.state.gameState.isRoundScoreCalculated) {
      players.forEach((player: any) => {
        player.roundScore = this.getScore(
          this.state.gameState.currentProduct.price,
          player.guessedPrice
        )
        player.roundScores.push(player.roundScore)
        player.score += player.roundScore
      })
      this.state.gameState.isRoundScoreCalculated = true
    }

    // Show round finish screen
    if (!this.state.gameState.isBetweenRounds) {
      this.state.gameState.isBetweenRounds = true
      this.clock.setTimeout(() => {
        // Check if game is over
        // currentRound is 0 based!
        if (
          this.state.gameState.currentRound + 1 ===
          this.state.gameState.gameSettings.rounds
        ) {
          this.state.gameState.gameEnded = true
        }
        this.state.gameState.roundEnded = true
      }, this.state.gameState.gameSettings.betweenRoundsTime * 1000)
    }
  }

  endGame(players: Array<PlayerState>) {
    // Show scoreboard
    // Determine winner --> player with the highest score
    // TODO: Handle 2 Players with the same score
    const winner = players.reduce((prev: any, current: any) => {
      return prev.score > current.score ? prev : current
    }, 0)

    winner.winner = true

    // Calculate avgPrecision of winner
    winner.avgPrecision = this.getAvgPrecision(winner.roundScores)

    // Update metaStats
    updateMetaStats('gameEnded')
  }

  onCreate(options: any) {
    // Initialize GameState
    this.setState(new MainState())

    this.setSimulationInterval(() => {
      // Check if game has started
      if (
        this.state.gameState.gameStarted &&
        !this.state.gameState.isGameStarted
      ) {
        this.state.gameState.isGameStarted = true
        // Start the game
        this.startGame(this.state.gameState.gameSettings)
      }

      // Check if game has ended
      if (this.state.gameState.gameEnded && !this.state.gameState.isGameEnded) {
        this.state.gameState.isGameEnded = true
        this.endRound(this.state.gameState.playerStates)
        this.endGame(this.state.gameState.playerStates)
      }
      if (this.state.gameState.roundEnded) {
        this.startRound()
      }

      if (
        this.state.gameState.isAllPlayerGuessed &&
        !this.state.gameState.isBetweenRounds
      ) {
        // Check if round has ended
        this.endRound(this.state.gameState.playerStates)
      }
    })

    this.onMessage('randomNameChange', (client, message) => {
      this.handleRandomNameChange(client, this.state.gameState.playerStates)
    })

    this.onMessage('nameChange', (client, message) => {
      this.handleNameChange(
        client,
        message.name,
        this.state.gameState.playerStates
      )
    })

    this.onMessage('avatarChange', (client, message) => {
      this.handleAvatarChange(client, this.state.gameState.playerStates)
    })

    this.onMessage('settings', (client, message) => {
      // Check if admin
      if (this.isAdmin(client.sessionId)) {
        // If no admin send error and return
        // send error message --> no admin rights
        client.send('error', {
          type: 'critical',
          message: 'Sorry - nur der Lobby Leiter kann die Einstellungen ändern.'
        })
        return
      }

      this.handleSettings(client, message, this.state.gameState.gameSettings)
    })

    this.onMessage('startGame', (client, message) => {
      // Check if admin
      if (this.isAdmin(client.sessionId)) {
        // If no admin send error and return
        // send error message --> no admin rights
        client.send('error', {
          type: 'critical',
          message: 'Sorry - nur der Lobby Leiter kann das Spiel starten.'
        })
        return
      }

      // change state to game started
      this.state.gameState.gameStarted = true
    })

    this.onMessage('restartGame', (client, message) => {
      // Check if admin
      if (this.isAdmin(client.sessionId)) {
        // If no admin send error and return
        // send error message --> no admin rights
        client.send('error', {
          type: 'critical',
          message: 'Sorry - nur der Lobby Leiter kann das Spiel neustarten.'
        })
        return
      }
      this.restartGame()
    })

    this.onMessage('guessedPrice', (client, message) => {
      // Updates guessedPrice in player state
      // Returns true if all Players guessed a price
      const allPlayersGuessed = this.handlePlayerGuess(
        client,
        message,
        this.state.gameState.playerStates
      )
      // If all players guessed a price end the round in 5 seconds
      if (allPlayersGuessed) {
        this.state.gameState.allPlayerGuessed = true
        this.clock.setTimeout(() => {
          this.state.gameState.isAllPlayerGuessed = true
        }, 5 * 1000)
      }
    })

    // Keep's the ws connection alive on heroku
    // https://devcenter.heroku.com/articles/websockets#timeouts
    this.onMessage('alivePing', (client, message) => {
      this.clock.setTimeout(() => {
        client.send('alivePong')
      }, 1000 * 30)
    })
  }

  onJoin(client: Client, options: any) {
    // Check if maxPlayer count is reached
    if (
      this.state.gameState.gameSettings.maxPlayers ===
      this.state.gameState.playerCount
    ) {
      // send error message --> maxPlayer count reached
      client.send('error', {
        type: 'critical',
        message: 'Sorry - die maximale Anzahl an Spielern ist erreicht.'
      })
      return
    }
    // Find next dummy in playerStates
    const index = this.state.gameState.playerStates.findIndex(
      (player: any) => player.id === 'dummy'
    )

    // Replace dummy if there is one
    if (index !== -1) {
      this.state.gameState.playerStates[index] = new PlayerState(
        client.sessionId
      )
    } else {
      // Add new player to playerState
      this.state.gameState.playerStates.push(new PlayerState(client.sessionId))
    }

    // Update playerCount
    const allPlayers = this.state.gameState.playerStates.filter(
      (player: any) => player.id !== 'dummy'
    )
    this.state.gameState.playerCount = allPlayers.length

    // Check if admin (first player)
    if (this.state.gameState.playerCount === 1) {
      this.state.gameState.playerStates[0].admin = true
    }
  }

  async onLeave(client: Client, consented: boolean) {
    const playerIndex = this.state.gameState.playerStates.findIndex(
      (player: PlayerState) => player.id === client.sessionId
    )

    // flag client as inactive for other users
    this.state.gameState.playerStates[playerIndex].connected = false

    try {
      if (consented) {
        // remove player
        this.removePlayer(playerIndex)
      }

      // allow disconnected client to reconnect into this room until 120 seconds
      await this.allowReconnection(client, 120)

      // client returned! let's re-activate it.
      this.state.gameState.playerStates[playerIndex].connected = true
    } catch (e) {
      // 120 seconds expired. let's remove the client.
      this.removePlayer(playerIndex)
    }
  }

  onDispose() {}
}
