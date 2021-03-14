import { ArraySchema } from '@colyseus/schema'
import { PlayerState } from '../rooms/schema/GameState'

export const createDummies = (count: number) => {
  let dummies: any = new ArraySchema()

  // create Dummy
  for (let i = 0; i < count; i++) {
    dummies.push(new PlayerState())
  }

  return dummies
}
