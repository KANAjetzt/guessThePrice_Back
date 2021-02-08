import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'
import { Product, Products, Imgs } from './MyRoomState'
import { generateName } from '../../utils/name'

export class PlayerState extends Schema {
  @type('string')
  id: string

  @type('string')
  name: string

  @type('number')
  guessedPrice: number

  @type('number')
  score: number

  constructor(
    id: string,
    name: string = generateName(),
    guessedPrice: number = 0,
    score: number = 0
  ) {
    super()
    this.id = id
    this.name = name
    this.guessedPrice = guessedPrice
    this.score = score
  }
}
export class GameState extends Schema {
  @type([PlayerState])
  playerStates: PlayerState[]

  @type(Product)
  currentProduct: Product

  @type([Product])
  products: [Product]

  @type('number')
  currentRound: number

  @type('boolean')
  isRoundScoreCalculated: boolean

  @type('boolean')
  roundEnded: boolean

  @type('boolean')
  gameEnded: boolean

  @type('boolean')
  isGameEnded: boolean

  constructor() {
    super()
    this.playerStates = new ArraySchema()
    this.currentProduct = new Product(
      0,
      'Loading Link',
      'Loading Searchterm',
      'Loading Title',
      1000,
      'Loading Star Rating',
      0,
      [],
      { map: 'string' },
      'Loading Description',
      new Imgs([''], [''])
    )
    this.products = [
      new Product(
        0,
        'Loading Link',
        'Loading Searchterm',
        'Loading Title',
        1000,
        'Loading Star Rating',
        0,
        [],
        { map: 'string' },
        'Loading Description',
        new Imgs([''], [''])
      )
    ]

    this.currentRound = 0
    this.isRoundScoreCalculated = false
    this.roundEnded = false
    this.gameEnded = false
    this.isGameEnded = false
  }
}
