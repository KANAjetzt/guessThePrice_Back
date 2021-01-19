import { Schema, type } from '@colyseus/schema';
import { Product } from './MyRoomState';

export class GameState extends Schema {
  @type(Product)
  currentProduct: Product;

  constructor(currentProduct: Product = new Product()) {
    super();
    this.currentProduct = currentProduct;
  }
}
