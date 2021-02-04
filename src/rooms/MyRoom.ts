import { Room, Client } from 'colyseus'
import { Product, Imgs, Products } from './schema/MyRoomState'
import { GameState, PlayerState } from './schema/GameState'
import { getOne } from '../DB/controllers/factory'
import ProductModel from '../DB/models/product'

// 🛠 WIP 🛠: Get 10 random DB entries
// This 10 entries are in row - so there will be the same products in a row

const getRandomArbitrary = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const getProducts = async () => {
  const productCount = await ProductModel.estimatedDocumentCount()

  const products = await ProductModel.find()
    .skip(getRandomArbitrary(0, productCount - 10))
    .limit(10)

  return products
}

// Calculate player score
const getScore = (productPrice: number, playerGuessedPrice: number) => {
  let difference = productPrice - playerGuessedPrice
  if (difference < 0) difference = difference * -1

  // percentage to the actual price
  const percentage = (productPrice / 100 / difference).toFixed(2)

  // create score
  const score = (100 - parseInt(percentage.split('.')[1], 10)) * 10
  console.log(score)

  return score
}

export class MyRoom extends Room {
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
      // Check for product update

      // Check if round has ended
      if (this.state.roundEnded) {
        // check if scores where calculated before for this round
        if (this.state.isRoundScoreCalculated) return
        // calculate score for players
        console.log('--- calculate player score ---')
        this.state.playerStates.forEach((player: any) => {
          player.score = getScore(
            this.state.currentProduct.productPrice,
            player.guessedPrice
          )
        })

        this.state.isRoundScoreCalculated = true
      }
    })

    this.onMessage('guessedPrice', (client, message) => {
      console.log(client.sessionId, "sent 'action' message: ", message)

      // Get the index of the player that guessed the price
      const index = this.state.playerStates.findIndex(
        (e: any) => e.id === client.sessionId
      )

      // Update guessedPrice in player state
      this.state.playerStates[index].guessedPrice = message.guessedPrice

      // Get players that didn't guessed yet
      const playersNotGuessed = this.state.playerStates.filter((e: any) => {
        return e.guessedPrice === 0
      })

      console.log(playersNotGuessed)

      // Check if all players guessed a price
      if (playersNotGuessed.length === 0) {
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
