import { Room, Client } from 'colyseus'
import { ArraySchema } from '@colyseus/schema'
import { Product, Imgs, Products } from './schema/MyRoomState'
import { GameSettings, GameState, PlayerState } from './schema/GameState'
import { getOne } from '../DB/controllers/factory'
import ProductModel from '../DB/models/product'
import { getAvatar } from '../utils/getAvatar'
import { createDummies } from '../utils/createDummies'

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

export class MyRoom extends Room {
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

  handleMaxPlayersChange(
    client: any,
    playerCount: number,
    dummyCount: number,
    maxPlayers: number
  ) {
    // Check if more players are connected then the maxPlayer setting should be
    if (playerCount > maxPlayers) {
      // send error message --> playerCount is higher then maxPlayers
      client.send('error', {
        type: 'critical',
        message: 'Sorry - es sind schon mehr Spieler in der Lobby.'
      })
      return
    }

    // Calculate the amount of dummies to remove / add
    const dummyValue = maxPlayers - playerCount - dummyCount

    if (dummyValue > 0) {
      // add dummies to the playerStates
      for (let i = 0; i < dummyValue; i++) {
        this.state.playerStates.push(new PlayerState())
      }
    } else if (dummyValue < 0) {
      // remove dummies from the playerStates
      let positiveDummyValue = dummyValue * -1

      this.state.playerStates = this.state.playerStates.reduce(
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
        this.state.playerCount,
        this.state.playerStates.filter((player: any) => player.id === 'dummy')
          .length,
        this.state.gameSettings.maxPlayers
      )
    }
  }

  handlePlayerGuess(client: any, message: any, players: Array<PlayerState>) {
    console.log(client.sessionId, "sent 'action' message: ", message)

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

    this.state.playerStates = this.state.playerStates.filter(
      (player: any) => player.id !== 'dummy'
    ) // Load 10 products into products state
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

      this.state.products = products

      // Grab one product and set it to currentProduct
      this.state.currentProduct = this.state.products.$items.get(0)

      this.state.isProductsLoaded = true
      this.state.isGameRestarted = false
    })()
  }

  restartGame() {
    const savedPlayerStates = this.state.playerStates.map(
      (player: PlayerState) => {
        return new PlayerState(player.id, player.name, player.avatar)
      }
    )

    this.setState(new GameState(this.state.gameSettings, savedPlayerStates))

    this.state.isGameRestarted = true
  }

  // Start the round
  startRound() {
    // Reset round state
    this.state.roundEnded = false
    this.state.isRoundScoreCalculated = false
    this.state.isBetweenRounds = false
    this.state.isAllPlayerGuessed = false

    // Update currentRound state
    this.state.currentRound++

    // Reset player guessedPrice
    this.state.playerStates.forEach((player: any) => {
      player.guessedPrice = 0
      player.roundScore = 0
    })

    // Set new currentProduct
    this.state.currentProduct = this.getProduct(
      this.state.products,
      this.state.currentRound
    )
  }

  endRound(players: Array<PlayerState>) {
    // Calculate player scores
    if (!this.state.isRoundScoreCalculated) {
      players.forEach((player: any) => {
        player.roundScore = this.getScore(
          this.state.currentProduct.price,
          player.guessedPrice
        )
        player.roundScores.push(player.roundScore)
        player.score += player.roundScore
      })
      this.state.isRoundScoreCalculated = true
    }

    // Show round finish screen for 5 seconds
    // TODO: Game shoul'd be ended from here, after the 5 seconds round end state
    if (!this.state.isBetweenRounds) {
      this.state.isBetweenRounds = true
      this.clock.setTimeout(() => {
        this.state.roundEnded = true
      }, 5 * 1000)
    }
  }

  endGame(players: Array<PlayerState>) {
    // Show scoreboard

    console.log('game has ended')
    // Determine winner --> player with the highest score
    // TODO: Handle 2 Players with the same score
    const winner = players.reduce((prev: any, current: any) => {
      return prev.score > current.score ? prev : current
    }, 0)

    winner.winner = true

    // Calculate avgPrecision of winner
    winner.avgPrecision = this.getAvgPrecision(winner.roundScores)
  }

  onCreate(options: any) {
    // Initialize GameState
    this.setState(new GameState())

    this.setSimulationInterval(() => {
      // Check if game has started
      if (this.state.gameStarted && !this.state.isGameStarted) {
        this.state.isGameStarted = true
        // Start the game
        this.startGame(this.state.gameSettings)
      }

      // Check if game has ended
      if (this.state.gameEnded && !this.state.isGameEnded) {
        this.state.isGameEnded = true
        this.endRound(this.state.playerStates)
        this.endGame(this.state.playerStates)
      }
      if (this.state.roundEnded) {
        this.startRound()
      }

      if (this.state.isAllPlayerGuessed && !this.state.isBetweenRounds) {
        // Check if round has ended
        this.endRound(this.state.playerStates)
      }
    })

    this.onMessage('nameChange', (client, message) => {
      this.handleNameChange(client, message.name, this.state.playerStates)
    })

    this.onMessage('avatarChange', (client, message) => {
      this.handleAvatarChange(client, this.state.playerStates)
    })

    this.onMessage('settings', (client, message) => {
      this.handleSettings(client, message, this.state.gameSettings)
    })

    this.onMessage('startGame', (client, message) => {
      // change state to game started
      this.state.gameStarted = true
    })

    this.onMessage('restartGame', (client, message) => {
      console.log('restart Game!')
      this.restartGame()
    })

    this.onMessage('guessedPrice', (client, message) => {
      // Updates guessedPrice in player state
      // Returns true if all Players guessed a price
      const allPlayersGuessed = this.handlePlayerGuess(
        client,
        message,
        this.state.playerStates
      )
      // If all players guessed a price end the round or game
      if (
        allPlayersGuessed &&
        this.state.currentRound === this.state.products.length - 1
      ) {
        this.state.isAllPlayerGuessed = true
        this.state.gameEnded = true
      } else if (allPlayersGuessed) {
        this.state.isAllPlayerGuessed = true
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
    if (this.state.gameSettings.maxPlayers === this.state.playerCount) {
      // send error message --> maxPlayer count reached
      client.send('error', {
        type: 'critical',
        message: 'Sorry - die maximale Anzahl an Spielern ist erreicht.'
      })
      return
    }
    // Find next dummy in playerStates
    const index = this.state.playerStates.findIndex(
      (player: any) => player.id === 'dummy'
    )

    // Replace dummy if there is one
    if (index !== -1) {
      this.state.playerStates[index] = new PlayerState(client.sessionId)
    } else {
      // Add new player to playerState
      this.state.playerStates.push(new PlayerState(client.sessionId))
    }

    // Update playerCount
    this.state.playerCount = this.state.playerStates.filter(
      (player: any) => player.id !== 'dummy'
    ).length
  }

  onLeave(client: Client, consented: boolean) {
    // TODO: Remove player from playerState (? reconnect ?)

    // Update playerCount
    this.state.playerCount = this.state.playerStates.length
  }

  onDispose() {}
}
