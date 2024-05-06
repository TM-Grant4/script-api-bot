import { Player } from "../Script Api/Player.js";
import { ScriptClient } from "../../index.js";
import { key } from "../utils.js";

export class PlayerJoinEvent {

    private callbacks = new Map<string, (data: { player: Player }) => void>()

    constructor(client: ScriptClient) {
        const BPClient = client.getClient()

        BPClient.once("player_list", () => {
            this.run({ player: new Player(client, "yuh") })
        })
    }

    subscribe(callback: (data: { player: Player }) => void): (data: { player: Player }) => void {
        callback["id"] = key()
        this.callbacks.set(callback["id"], callback)
        return callback
    }

    unsubscribe(callback: (data: { player: Player }) => void): void {
        this.callbacks.delete(callback["id"] ?? "")
    }

    private run(data: { player: Player }) {
        this.callbacks.forEach(callback => callback(data))
    }
}