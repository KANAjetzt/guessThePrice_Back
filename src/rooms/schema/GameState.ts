import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema'
import { Product, Products, Imgs } from './MyRoomState'
import { generateName } from '../../utils/name'
import { getAvatar } from '../../utils/getAvatar'
import { createDummies } from '../../utils/createDummies'

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

  @type(['number'])
  roundScores: number[]

  @type('number')
  avgPrecision: number

  @type('number')
  score: number

  @type('boolean')
  connected: boolean

  @type('boolean')
  winner: boolean

  constructor(
    id: string = 'dummy',
    name: string = generateName(id),
    avatar: string = getAvatar(id),
    guessedPrice: number = 0,
    roundScore: number = 0,
    roundScores: number[] = new ArraySchema(),
    avgPrecision: number = 0,
    score: number = 0,
    connected: boolean = true,
    winner: boolean = false
  ) {
    super()
    this.id = id
    this.name = name
    this.avatar = avatar
    this.guessedPrice = guessedPrice
    this.roundScore = roundScore
    this.roundScores = roundScores
    this.avgPrecision = avgPrecision
    this.score = score
    this.connected = connected
    this.winner = winner
  }
}

export class GameSettings extends Schema {
  @type('number')
  rounds: number

  @type('number')
  maxPlayers: number

  @type('number')
  betweenRoundsTime: number

  @type('boolean')
  showGuessedPrice: boolean

  constructor(
    rounds: number = 5,
    maxPlayers: number = 5,
    betweenRoundsTime: number = 5,
    showGuessedPrice: boolean = false
  ) {
    super()
    this.rounds = rounds
    this.maxPlayers = maxPlayers
    this.betweenRoundsTime = betweenRoundsTime
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
  isGameRestarted: boolean

  @type('boolean')
  isProductsLoaded: boolean

  @type('boolean')
  gameEnded: boolean

  @type('boolean')
  isGameEnded: boolean

  constructor(
    gameSettings: GameSettings = new GameSettings(),
    playerStates: PlayerState[] = createDummies(gameSettings.maxPlayers)
  ) {
    super()
    this.gameSettings = gameSettings
    this.playerStates = playerStates
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
    this.playerCount = 0
    this.isAllPlayerGuessed = false
    this.isRoundScoreCalculated = false
    this.roundEnded = false
    this.isBetweenRounds = false
    this.gameStarted = false
    this.isGameStarted = false
    this.isGameRestarted = false
    this.isProductsLoaded = false
    this.gameEnded = false
    this.isGameEnded = false
  }
}
