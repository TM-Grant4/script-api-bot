import type { WorldAfterEvents, WorldBeforeEvents } from "@minecraft/server";
import { Client, ClientStatus, createClient } from "bedrock-protocol";
import type { ScriptClientOptions } from "./Types/Client.js";
import { Link } from "./Classes/Link.js";

type AfterEvents = {
	//@ts-ignore
	[K in `after${Capitalize<keyof WorldAfterEvents>}`]: K extends `after${infer P}` ? Parameters<Parameters<WorldAfterEvents[Uncapitalize<P>]["subscribe"]>[0]>[0] : never
}

type BeforeEvents = {
	//@ts-ignore
	[K in `before${Capitalize<keyof WorldBeforeEvents>}`]: K extends `before${infer P}` ? Parameters<Parameters<WorldBeforeEvents[Uncapitalize<P>]["subscribe"]>[0]>[0] : never
}

type Events = AfterEvents & BeforeEvents

class ScriptClient {

	private isInitialized: boolean = false;
	private events: Record<string, Array<(data: any) => void>> = {}
	private client: Client;
	public link: Link

	/**
	 * @param client 
	 * @param username Allows for the use of ScriptClient.self
	 */
	constructor(options: ScriptClientOptions) {
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
		})

		this.link = new Link(this)

		this.onClientJoin().then(() => {
			this.sendCommand(`scriptevent blqzed:script_bot_init ${this.link}`)
			this.link.send(`eval`, `console.warn('no bitches?')`)
		})

		process.on("SIGINT", () => {
			client.leave()
			setTimeout(() => process.exit(1), 100)
		})
	}

	public getClient(): Client {
		return this.client
	}

	public onEvent<E extends keyof Events>(event: E, callback: (data: Events[E]) => void) {
		if (!this.events.hasOwnProperty(event)) this.sendMessage(`event ${event}`);
		(this.events[event] ??= []).push(callback)
	}

	public sendMessage(message: string) {
		this.client.write('text', {
			type: 'chat',
			needs_translation: false,
			source_name: '',
			xuid: '',
			platform_chat_id: '',
			message
		})
		return this;
	}

	public sendCommand(command: string) {
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
	public async onClientJoin() {
		return new Promise<void>(resolve => {
			const callback = ({ status }) => {
				if (status === "player_spawn") {
					resolve()
					this.client.off("play_status", callback)
				}
			}
			this.client.on("play_status", callback)
		})
	}

	public async onLinked() {
		return this.link.onLinked()
	}

	public leave() {
		this.client.disconnect()
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
})

process.stdin.on("data", (buffer) => {
	const str = buffer.toString()
	console.log(str.trim())
	console.log(client.link.send("eval", str.trim()))
})