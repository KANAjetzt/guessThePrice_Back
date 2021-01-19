import { Room, Client } from 'colyseus';
import { Product } from './schema/MyRoomState';
import { GameState } from './schema/GameState';
import { getOne } from '../DB/controllers/factory';
import ProductModel from '../DB/models/product';

const getProduct = async () => {
  console.log('--- getProduct ---');
  let stuff = await ProductModel.findById('6003702af3485f0bdc80bf5c');
  return stuff;
};
export class MyRoom extends Room {
  onCreate(options: any) {
    this.setState(new GameState());

    const awaitProduct = async () => {
      const product: any = await getProduct();

      console.log(product);

      console.log(this.state.currentProduct);

      this.state.currentProduct = new Product(
        product.price,
        product.title,
        product.description,
        product.stars,
        product.img
      );
    };

    awaitProduct();

    this.onMessage('type', (client, message) => {
      //
      // handle "type" message
      //
    });
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
