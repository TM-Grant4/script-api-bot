import { PlayerJoinEvent } from "./PlayerJoin.js";
export class EventManager {
    playerJoin;
    constructor(client) {
        this.playerJoin = new PlayerJoinEvent(client);
    }
}
