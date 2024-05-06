import { Player } from "../Script Api/Player.js";
import { ScriptClient } from "../../index.js";
export declare class PlayerJoinEvent {
    private callbacks;
    constructor(client: ScriptClient);
    subscribe(callback: (data: {
        player: Player;
    }) => void): (data: {
        player: Player;
    }) => void;
    unsubscribe(callback: (data: {
        player: Player;
    }) => void): void;
    private run;
}
