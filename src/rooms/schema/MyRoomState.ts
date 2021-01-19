import { Schema, type } from '@colyseus/schema';

export class Product extends Schema {
  @type('number')
  productPrice: number;

  @type('string')
  productTitle: string;

  @type('string')
  productDescription: string;

  @type('string')
  productStars: string;

  @type('string')
  productImg: string;

  constructor(
    productPrice: number = 1000,
    productTitle: string = 'Loading Title',
    productDescription: string = 'Loading Description',
    productStars: string = 'Loading Rating',
    productImg: string = 'Loading Image'
  ) {
    super();
    this.productPrice = productPrice;
    this.productTitle = productTitle;
    this.productDescription = productDescription;
    this.productStars = productStars;
    this.productImg = productImg;
  }
}

export class Player extends Schema {
  @type('number')
  playerGuessedPrice: number;

  constructor(playerGuessedPrice: number) {
    super();
    this.playerGuessedPrice = playerGuessedPrice;
  }
}
