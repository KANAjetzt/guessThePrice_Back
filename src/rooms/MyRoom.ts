import { Room, Client } from 'colyseus';
import { Product } from './schema/MyRoomState';
import { GameState, PlayerState } from './schema/GameState';
import { getOne } from '../DB/controllers/factory';
import ProductModel from '../DB/models/product';

// 🛠 WIP / TEST 🛠: Get one product by ID from DB
const getProduct = async () => {
  let stuff = await ProductModel.findById('6003702af3485f0bdc80bf5c');
  return stuff;
};
export class MyRoom extends Room {
  onCreate(options: any) {
    // Initialize GameState
    this.setState(new GameState());

    const awaitProduct = async () => {
      // Get 1 product from DB
      const product: any = await getProduct();

      // Add that to ProductState
      this.state.currentProduct = new Product(
        product.price,
        product.title,
        product.description,
        product.stars,
        product.img
      );
    };

    awaitProduct();

    this.onMessage('guessedPrice', (client, message) => {
      console.log(client.sessionId, "sent 'action' message: ", message);

      // Get the index of the player that guessed the price
      const index = this.state.playerStates.findIndex(
        (e: any) => e.id === client.sessionId
      );

      // Update guessedPrice in player state
      this.state.playerStates[index].guessedPrice = message.guessedPrice;
    });
  }

  onJoin(client: Client, options: any) {
    // Add new player to playerState
    this.state.playerStates.push(new PlayerState(client.sessionId));
  }

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
