import type { WorldAfterEvents, WorldBeforeEvents } from "@minecraft/server";
import { Client } from "bedrock-protocol";
import type { ScriptClientOptions } from "./Types/Client.js";
import { Link } from "./Classes/Link.js";
declare type AfterEvents = {
    [K in `after${Capitalize<keyof WorldAfterEvents>}`]: K extends `after${infer P}` ? Parameters<Parameters<WorldAfterEvents[Uncapitalize<P>]["subscribe"]>[0]>[0] : never;
};
declare type BeforeEvents = {
    [K in `before${Capitalize<keyof WorldBeforeEvents>}`]: K extends `before${infer P}` ? Parameters<Parameters<WorldBeforeEvents[Uncapitalize<P>]["subscribe"]>[0]>[0] : never;
};
declare type Events = AfterEvents & BeforeEvents;
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
    onEvent<E extends keyof Events>(event: E, callback: (data: Events[E]) => void): void;
    sendMessage(message: string): this;
    sendCommand(command: string): void;
    /**
     * Marks the client as initialized.
     */
    onClientJoin(): Promise<void>;
    onLinked(): Promise<any>;
    leave(): void;
}
export { ScriptClient };
