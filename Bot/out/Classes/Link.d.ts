import { ScriptClient } from "../index.js";
export declare class Link {
    private readonly client;
    protected key: string;
    linked: boolean;
    private requests;
    constructor(client: ScriptClient);
    send(type: string, value: any): void;
    sendAsync(type: string, value: any): Promise<any>;
    onLinked(): Promise<any>;
}
