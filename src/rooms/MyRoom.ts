import { Room, Client } from 'colyseus';
import { Product, Imgs } from './schema/MyRoomState';
import { GameState, PlayerState } from './schema/GameState';
import { getOne } from '../DB/controllers/factory';
import ProductModel from '../DB/models/product';

// 🛠 WIP / TEST 🛠: Get one product by ID from DB
const getProduct = async () => {
  let stuff = await ProductModel.findById('6019827e83a2821c5c297f95').exec();
  return stuff;
};

// Calculate player score
const getScore = (productPrice: number, playerGuessedPrice: number) => {
  let difference = productPrice - playerGuessedPrice;
  if (difference < 0) difference = difference * -1;

  // percentage to the actual price
  const percentage = (productPrice / 100 / difference).toFixed(2);

  // create score
  const score = (100 - parseInt(percentage.split('.')[1], 10)) * 10;
  console.log(score);

  return score;
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
        product.creationDate,
        product.link,
        product.searchterm,
        product.title,
        product.price,
        product.ratingStars,
        product.ratingCount,
        product.featureBullets,
        product.technicalDetails,
        product.description,
        new Imgs(product.imgs[0].mediumImgs, product.imgs[0].largeImgs)
      );
    };

    awaitProduct();

    this.setSimulationInterval(() => {
      // Check for product update

      // Check if round has ended
      if (this.state.roundEnded) {
        // check if scores where calculated before for this round
        if (this.state.isRoundScoreCalculated) return;
        // calculate score for players
        console.log('--- calculate player score ---');
        this.state.playerStates.forEach((player: any) => {
          player.score = getScore(
            this.state.currentProduct.productPrice,
            player.guessedPrice
          );
        });

        this.state.isRoundScoreCalculated = true;
      }
    });

    this.onMessage('guessedPrice', (client, message) => {
      console.log(client.sessionId, "sent 'action' message: ", message);

      // Get the index of the player that guessed the price
      const index = this.state.playerStates.findIndex(
        (e: any) => e.id === client.sessionId
      );

      // Update guessedPrice in player state
      this.state.playerStates[index].guessedPrice = message.guessedPrice;

      // Get players that didn't guessed yet
      const playersNotGuessed = this.state.playerStates.filter((e: any) => {
        return e.guessedPrice === 0;
      });

      console.log(playersNotGuessed);

      // Check if all players guessed a price
      if (playersNotGuessed.length === 0) {
        this.state.roundEnded = true;
      }
    });
  }

  onJoin(client: Client, options: any) {
    // Add new player to playerState
    this.state.playerStates.push(new PlayerState(client.sessionId));
  }

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
