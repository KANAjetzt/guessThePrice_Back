import { Schema, ArraySchema, type } from '@colyseus/schema'
import { Client, LobbyRoom } from 'colyseus'
import { PlayerState } from './schema/GameState'

class LobbyState extends Schema {
  @type('string') roomId: string
  @type('string') clientId: string

  @type([PlayerState])
  playerStates: PlayerState[]

  constructor() {
    super(), (this.playerStates = new ArraySchema())
  }
}

export class Lobby extends LobbyRoom {
  async onCreate(options: any) {
    await super.onCreate(options)

    this.setState(new LobbyState())

    this.state.roomId = this.roomId
  }

  onJoin(client: Client, options: any) {
    super.onJoin(client, options)
    // Add new player to playerState
    this.state.playerStates.push(new PlayerState(client.sessionId))

    this.state.clientId = client.sessionId
  }

  onLeave(client: Client) {
    super.onLeave(client)
  }
}
