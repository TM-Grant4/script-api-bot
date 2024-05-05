import { createClient } from "bedrock-protocol";
import { Link } from "./Classes/Link.js";
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
        this.onClientJoin().then(() => {
            this.sendCommand(`scriptevent blqzed:script_bot_init ${this.link}`);
            this.link.send(`eval`, `console.warn('no bitches?')`);
        });
        process.on("SIGINT", () => {
            client.leave();
            setTimeout(() => process.exit(1), 100);
        });
    }
    getClient() {
        return this.client;
    }
    onEvent(event, callback) {
        if (!this.events.hasOwnProperty(event))
            this.sendMessage(`event ${event}`);
        (this.events[event] ??= []).push(callback);
    }
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
        return new Promise(resolve => {
            const callback = ({ status }) => {
                if (status === "player_spawn") {
                    resolve();
                    this.client.off("play_status", callback);
                }
            };
            this.client.on("play_status", callback);
        });
    }
    async onLinked() {
        return this.link.onLinked();
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
process.stdin.on("data", (buffer) => {
    const str = buffer.toString();
    console.log(str.trim());
    console.log(client.link.send("eval", str.trim()));
});
