import { Vector3 } from "@minecraft/server";
import { ScriptClient } from "../../index.js";

export class Player {
    constructor(private readonly client: ScriptClient, public readonly record: any) {

    }

    async getLocation(): Promise<Vector3> {
        return this.client.link.sendAsync("getPlayer", { name: this.record.username, property: "location" })
    }
}