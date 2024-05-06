import { Vector3 } from "@minecraft/server";
import { ScriptClient } from "../../index.js";
export declare class Player {
    private readonly client;
    readonly record: any;
    constructor(client: ScriptClient, record: any);
    getLocation(): Promise<Vector3>;
}
