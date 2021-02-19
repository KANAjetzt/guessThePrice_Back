import { Room, Client } from 'colyseus'
import { Product, Imgs, Products } from './schema/MyRoomState'
import { GameState, PlayerState } from './schema/GameState'
import { getOne } from '../DB/controllers/factory'
import ProductModel from '../DB/models/product'

const getRandomArbitrary = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

// 🛠 WIP 🛠: Get 10 random DB entries
// This 10 entries are in row - so there will be the same products in a row
const getProducts = async () => {
  const products = await ProductModel.aggregate([
    {
      $sample: { size: 5 }
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

  // Get product from products state
  getProduct(products: Array<Product>, currentRound: number) {
    return products[currentRound]
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

  // Start the round
  startRound() {
    // Reset round state
    this.state.roundEnded = false
    this.state.isRoundScoreCalculated = false

    // Update currentRound state
    this.state.currentRound++

    // Reset player guessedPrice
    this.state.playerStates.forEach((player: any) => (player.guessedPrice = 0))

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
        player.score += this.getScore(
          this.state.currentProduct.price,
          player.guessedPrice
        )
      })
      this.state.isRoundScoreCalculated = true
    }
  }

  endGame() {
    // Show scoreboard
    if (!this.state.isGameEnded) {
      console.log('game has ended')
      this.state.isGameEnded = true
    }
  }

  onCreate(options: any) {
    // Initialize GameState
    this.setState(new GameState())

    // Load 10 products into products state
    ;(async () => {
      const products = (await getProducts()).map(
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
    })()

    this.setSimulationInterval(() => {
      // Check if game has ended
      if (this.state.gameEnded) {
        this.endRound(this.state.playerStates)
        this.endGame()
        return
      }

      if (this.state.roundEnded) {
        // Check if round has ended
        this.endRound(this.state.playerStates)
      }
      if (this.state.isRoundScoreCalculated) {
        this.startRound()
      }
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
        this.state.roundEnded = true
        this.state.gameEnded = true
      } else if (allPlayersGuessed) {
        this.state.roundEnded = true
      }
    })
  }

  onJoin(client: Client, options: any) {
    // Add new player to playerState
    this.state.playerStates.push(new PlayerState(client.sessionId))
  }

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
