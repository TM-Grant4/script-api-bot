import { ScriptClient } from "../../index.js";
import { PlayerJoinEvent } from "./PlayerJoin.js";

export class EventManager {
    readonly playerJoin: PlayerJoinEvent
    constructor(client: ScriptClient) {
        this.playerJoin = new PlayerJoinEvent(client)
    }
}