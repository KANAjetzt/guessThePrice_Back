import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'
import { Product, Products, Imgs } from './MyRoomState'
import { generateName } from '../../utils/name'
import { getAvatar } from '../../utils/getAvatar'

export class PlayerState extends Schema {
  @type('string')
  id: string

  @type('string')
  name: string

  @type('string')
  avatar: string

  @type('number')
  guessedPrice: number

  @type('number')
  roundScore: number

  @type('number')
  score: number

  @type('boolean')
  winner: boolean

  constructor(
    id: string,
    name: string = generateName(),
    avatar: string = getAvatar(),
    guessedPrice: number = 0,
    roundScore: number = 0,
    score: number = 0,
    winner: boolean = false
  ) {
    super()
    this.id = id
    this.name = name
    this.avatar = avatar
    this.guessedPrice = guessedPrice
    this.roundScore = roundScore
    this.score = score
    this.winner = winner
  }
}

export class GameSettings extends Schema {
  @type('number')
  rounds: number

  @type('boolean')
  showGuessedPrice: boolean

  constructor(rounds: number = 5, showGuessedPrice: boolean = true) {
    super()
    this.rounds = rounds
    this.showGuessedPrice = showGuessedPrice
  }
}

export class GameState extends Schema {
  @type(GameSettings)
  gameSettings: GameSettings

  @type([PlayerState])
  playerStates: PlayerState[]

  @type(Product)
  currentProduct: Product

  @type([Product])
  products: [Product]

  @type('number')
  currentRound: number

  @type('number')
  playerCount: number

  @type('boolean')
  isAllPlayerGuessed: boolean

  @type('boolean')
  isRoundScoreCalculated: boolean

  @type('boolean')
  roundEnded: boolean

  @type('boolean')
  isBetweenRounds: boolean

  @type('boolean')
  gameStarted: boolean

  @type('boolean')
  isGameStarted: boolean

  @type('boolean')
  gameEnded: boolean

  @type('boolean')
  isGameEnded: boolean

  constructor() {
    super()
    this.gameSettings = new GameSettings()
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
    this.playerCount = [...this.playerStates].length
    this.isAllPlayerGuessed = false
    this.isRoundScoreCalculated = false
    this.roundEnded = false
    this.isBetweenRounds = false
    this.gameStarted = false
    this.isGameStarted = false
    this.gameEnded = false
    this.isGameEnded = false
  }
}
