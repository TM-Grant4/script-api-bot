import { ScriptClient } from "../../index.js";
import { PlayerJoinEvent } from "./PlayerJoin.js";
export declare class EventManager {
    readonly playerJoin: PlayerJoinEvent;
    constructor(client: ScriptClient);
}
