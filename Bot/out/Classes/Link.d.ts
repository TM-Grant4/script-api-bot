import { ScriptClient } from "../index.js";
export declare class Link {
    private readonly client;
    protected key: string;
    constructor(client: ScriptClient);
    send(type: string, value: any): void;
    sendAsync(type: string, value: any): Promise<any>;
}
