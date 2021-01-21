import { Schema, ArraySchema, type } from '@colyseus/schema';
import { Product } from './MyRoomState';
import { generateName } from '../../utils/name';

export class PlayerState extends Schema {
  @type('string')
  id: string;

  @type('string')
  name: string;

  @type('number')
  guessedPrice: number;

  @type('number')
  score: number;

  constructor(
    id: string,
    name: string = generateName(),
    guessedPrice: number = undefined,
    score: number = 0
  ) {
    super();
    this.id = id;
    this.name = name;
    this.guessedPrice = guessedPrice;
    this.score = score;
  }
}
export class GameState extends Schema {
  @type([PlayerState])
  playerStates: PlayerState[];

  @type(Product)
  currentProduct: Product;

  constructor(currentProduct: Product = new Product()) {
    super();
    this.playerStates = new ArraySchema();
    this.currentProduct = currentProduct;
  }
}
