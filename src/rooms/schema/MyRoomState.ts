import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema';

export class Imgs extends Schema {
  @type(['string'])
  mediumImgs: string[];

  @type(['string'])
  largeImgs: string[];

  constructor(mediumImgs: string[] = [], largeImgs: string[] = []) {
    super();
    this.mediumImgs = mediumImgs;
    this.largeImgs = largeImgs;
  }
}

export class Product extends Schema {
  @type('number')
  creationDate: number;

  @type('string')
  link: string;

  @type('string')
  searchterm: string;

  @type('string')
  title: string;

  @type('number')
  price: number;

  @type('string')
  ratingStars: string;

  @type('number')
  ratingCount: number;

  @type(['string'])
  featureBullets: string[];

  @type({ map: 'string' })
  technicalDetails: { map: 'string' };

  @type('string')
  description: string;

  @type([Imgs])
  imgs: Imgs;

  constructor(
    creationDate: number = 0,
    link: string = 'Loading Link',
    searchterm: string = 'Loading Searchterm',
    title: string = 'Loading Title',
    price: number = 1000,
    ratingStars: string = 'Loading Star Rating',
    ratingCount: number = 0,
    featureBullets: string[] = [],
    technicalDetails: { map: 'string' },
    description: string = 'Loading Description',
    imgs: Imgs
  ) {
    super();
    this.creationDate = creationDate;
    this.link = link;
    this.searchterm = searchterm;
    this.title = title;
    this.price = price;
    this.ratingStars = ratingStars;
    this.ratingCount = ratingCount;
    this.featureBullets = featureBullets;
    this.technicalDetails = technicalDetails;
    this.description = description;
    this.imgs = imgs;
  }
}

export class Products extends Schema {
  @type([Product])
  products: [Product];

  constructor(products: [Product]) {
    super();
    this.products = products;
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
