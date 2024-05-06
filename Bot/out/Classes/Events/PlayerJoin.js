import { Player } from "../Script Api/Player.js";
import { key } from "../utils.js";
export class PlayerJoinEvent {
    callbacks = new Map();
    constructor(client) {
        const BPClient = client.getClient();
        BPClient.once("player_list", () => {
            this.run({ player: new Player(client, "yuh") });
        });
    }
    subscribe(callback) {
        callback["id"] = key();
        this.callbacks.set(callback["id"], callback);
        return callback;
    }
    unsubscribe(callback) {
        this.callbacks.delete(callback["id"] ?? "");
    }
    run(data) {
        this.callbacks.forEach(callback => callback(data));
    }
}
