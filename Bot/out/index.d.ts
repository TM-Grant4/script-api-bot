import { Client } from "bedrock-protocol";
import type { ScriptClientOptions } from "./Types/Client.js";
import { Link } from "./Classes/Link.js";
declare class ScriptClient {
    private isInitialized;
    private events;
    private client;
    link: Link;
    /**
     * @param client
     * @param username Allows for the use of ScriptClient.self
     */
    constructor(options: ScriptClientOptions);
    getClient(): Client;
    sendMessage(message: string): this;
    sendCommand(command: string): void;
    /**
     * Marks the client as initialized.
     */
    onClientJoin(): Promise<void>;
    leave(): void;
}
export { ScriptClient };
