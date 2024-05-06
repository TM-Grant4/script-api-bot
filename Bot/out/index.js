import { createClient } from "bedrock-protocol";
import { Link } from "./Classes/Link.js";
// type AfterEvents = {
// 	//@ts-ignore
// 	[K in `after${Capitalize<keyof WorldAfterEvents>}`]: K extends `after${infer P}` ? Parameters<Parameters<WorldAfterEvents[Uncapitalize<P>]["subscribe"]>[0]>[0] : never
// }
// type BeforeEvents = {
// 	//@ts-ignore
// 	[K in `before${Capitalize<keyof WorldBeforeEvents>}`]: K extends `before${infer P}` ? Parameters<Parameters<WorldBeforeEvents[Uncapitalize<P>]["subscribe"]>[0]>[0] : never
// }
// type Events = AfterEvents & BeforeEvents
class ScriptClient {
    isInitialized = false;
    events = {};
    client;
    link;
    /**
     * @param client
     * @param username Allows for the use of ScriptClient.self
     */
    constructor(options) {
        //@ts-ignore
        this.client = options.realmCode ? createClient({
            realms: {
                realmInvite: options.realmCode
            }
        }) : createClient({
            //@ts-ignore
            username: "deez",
            host: options.host,
            port: options.port
        });
        this.link = new Link(this);
        const callback = ({ status }) => {
            if (status === "player_spawn") {
                this.client.off("play_status", callback);
                //@ts-ignore
                this.sendCommand(`scriptevent blqzed:script_bot_init ${this.link.key}`);
                this.isInitialized = true;
            }
        };
        this.client.on("play_status", callback);
        process.on("SIGINT", () => {
            client.leave();
            setTimeout(() => process.exit(1), 100);
        });
    }
    getClient() {
        return this.client;
    }
    // public onEvent<E extends keyof Events>(event: E, callback: (data: Events[E]) => void) {
    // 	if (!this.events.hasOwnProperty(event)) this.sendMessage(`event ${event}`);
    // 	(this.events[event] ??= []).push(callback)
    // }
    sendMessage(message) {
        this.client.write('text', {
            type: 'chat',
            needs_translation: false,
            source_name: '',
            xuid: '',
            platform_chat_id: '',
            message
        });
        return this;
    }
    sendCommand(command) {
        this.client.write("command_request", {
            command,
            internal: false,
            version: 72,
            origin: {
                type: 5,
                uuid: "",
                request_id: ""
            },
        });
    }
    /**
     * Marks the client as initialized.
     */
    async onClientJoin() {
        if (this.isInitialized)
            return Promise.resolve();
        return new Promise((resolve) => setTimeout(() => this.onClientJoin().then(resolve), 1000));
    }
    leave() {
        this.client.disconnect();
    }
}
/*
const devices: { [key: string]: string } = {
    "0": "Undefined",
    "1": "Android",
    "2": "iPhone",
    "3": "Mac PC",
    "4": "Amazon Fire",
    "5": "Oculus Gear VR",
    "6": "Hololens VR",
    "7": "Windows PC 64",
    "8": "Windows PC 32",
    "9": "Dedicated Server",
    "10": "T.V OS",
    "11": "PlayStation",
    "12": "Nintendo Switch",
    "13": "Xbox One",
    "14": "WindowsPhone",
    "15": "Linux"
};
*/
export { ScriptClient };
const client = new ScriptClient({
    // realmCode: "qqgFC6S9gKo",
    host: "127.0.0.1",
    port: 19132
});
process.stdin.on("data", async (buffer) => {
    const str = buffer.toString();
    console.log(await client.link.sendAsync("eval", str.trim()).catch(message => message));
});
client.getClient().on("set_health", (player) => {
    console.log(player);
});
