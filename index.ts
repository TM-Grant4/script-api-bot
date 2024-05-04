import { WorldAfterEvents, WorldBeforeEvents } from "@minecraft/server";
import { Client, ClientStatus } from "bedrock-protocol";
import { Player } from "./classes/Player"

interface ActionFormResponse {
	selection: number;
}

interface ModalFormResponse {
	formValues: (number | string)[] | string[] | number[];
}

type AfterEvents = {
	//@ts-ignore
	[K in `after${Capitalize<keyof WorldAfterEvents>}`]: K extends `after${infer P}` ? Parameters<Parameters<WorldAfterEvents[Uncapitalize<P>]["subscribe"]>[0]>[0] : never
}

type BeforeEvents = {
	//@ts-ignore
	[K in `before${Capitalize<keyof WorldBeforeEvents>}`]: K extends `before${infer P}` ? Parameters<Parameters<WorldBeforeEvents[Uncapitalize<P>]["subscribe"]>[0]>[0] : never
}

type Events = AfterEvents & BeforeEvents

/**
 * @example
 * const { createClient } = require(`bedrock-protocol`);
 * const
 *
 * const client = new create(createClient({ host: `ip`, port: 0, username: `` }));
 *
 * client.onGame(`beforeChatSend`, ((event) => {
 *     if (event.message.startsWith(`!`)) {
 *         //do stuff
 *     }
 * }));
 */

type varTypes = {
	let: any,
	const: any,
	var: any
}

/**
 * @example
 * const { createClient } = require(`bedrock-protocol`);
 * const { create } = require(`script-api-bot`);
 *
 * const bedrockClient = createClient({
 *     host: `cubecraft.net`,
 *     port: 19132,
 *     username: `NotTMGrant`
 * });
 *
 * const client = new create(bedrockClient);
 *
 * client.onGame(`beforeChatSend`, ((event) => {
 *     if (event.message.startsWith(`!`)) {
 *         //do stuff
 *     }
 * }));
 */
class ScriptClient extends Client {
	private isInitialized: boolean = false;
	private variables: string[] = [];
	private functions: string[] = [];
	private client: any | ScriptClient;
	private currentPlayerListPacket: number = 0;

	public self: Player | undefined = undefined;

	/**
	 * @param client 
	 * @param username Allows for the use of ScriptClient.self
	 */
	constructor(client: Client, username: string = ``) {
		//@ts-ignore
		super(client);
		this.client = new ScriptClient(client);
		(async () => {
			this.self = (await this.findPlayer(username));
			setInterval(() => {
				if (client.status === ClientStatus.Initialized) return;
				this.initialize();
				return this;
			}, 500);
		})()
	}
	/**
	 * Registers a callback for a specific event if the client is initialized.
	 * @template K - The type of event.
	 * @param {K} event - The name of the event to listen for.
	 * @param {(event: any) => void} callback - The callback function to be executed when the event occurs.
	 */
	public onEvent<E extends keyof Events>(event: E, callback: (event: Events[E]) => void) {
		if (this.isInitialized) {
			const jsonData: { type: string, function: string } = {
				type: `${event}`,
				function: `${this.variables.join(`\n`)}
                \n` + callback.toString()
			};

			this.sendMessage(`addListener ${JSON.stringify(jsonData)}`);
		} else {
			console.log("Client is not yet initialized. Event registration will rerun once initialized");
			setTimeout(() => {
				this.onEvent(event, callback)
			}, 5000);
		}
		return this;
	}

	/**
	 * setVar
	 *
	 * This will set a variable to use in the callback, this will not be defined, just use it as a normal variable as if it were like this.
	 * @example
	 * ```javascript
	 * const variable1 = `hello`;
	 * console.log(variable1);
	 * ```
	 */
	public setVar<T extends keyof varTypes>(type: T, name: string, setVariable: any,) {
		this.variables.push(`${type} ${name} = ${setVariable}`)
		return this;
	}

	/**
	 * createFunction
	 *
	 * This will create a function to use in the callback, this will not be defined, just use it as a normal function as if it were like this.
	 * @example
	 * ```javascript
	 * function function1(hello) {
	 *     console.log(`d`);
	 * }
	 * 
	 * ScriptClient.createFunction(function1)
	 * ```
	 */
	public createFunction(functionString: string) {
		this.functions.push(functionString);
		return this;
	}
	public sendMessage(message: string) {
		this.client.write('text', {
			type: 'chat',
			needs_translation: false,
			source_name: `i.am.grant`,
			xuid: '',
			platform_chat_id: '',
			message: `${message}`
		})
		return this;
	}
	/**
	 * Usable with xuid for a players name replacement
	 * @example
	 * ```
	 * /kick 2538374643937 kicked by bot
	 * ```
	 */
	public sendCommand(command: string) {
		this.client.write("command_request", {
			command: command,
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
	 * Sets the dynamic property of the world 
	 */
	public setDynamicProperty(property: string, value: string | number | string[] | number[]) {
		const jsonData = {
			type: `world`,
			property: property,
			value: value
		}
		this.sendMessage(`setDynamicProperty ${JSON.stringify(jsonData)}`);
		return this;
	}

	public getDynamicProperty(name: string, property: string) {
		const jsonData = {
			name: name,
			property: property
		};
		this.sendMessage(`getDynamicProperty ${JSON.stringify(jsonData)}`);
		this.client.on(`text`, (packet: { type: string, message: string }) => {
			if (packet.type === `json_whisper`) {
				if (packet.message.startsWith(`json `)) {
					packet.message.replace(`json `, ``);
					const jsonData = JSON.parse(packet.message);
					if (jsonData.type === `worldDynamicProperty`) return jsonData.value;
				}
			}
		})
	}

	public async getPlayers(): Promise<Player[]> {
		this.sendMessage('getAllPlayers');
		return new Promise((resolve, reject) => {
			const players: Player[] = [];
			
			this.client.on('text', (packet: { type: string, message: string }) => {
				if (packet.type === 'json_whisper') {
					if (packet.message.startsWith('json ')) {
						const jsonData: { type: string, players: string[] } = JSON.parse(packet.message.replace('json ', '').replace('{"rawtext":[{"text":"', '').replace('"}]}', ''));
						if (jsonData.type === 'allPlayers') {
							Promise.all(jsonData.players.map((p: string) => this.findPlayer(p)))
								.then((foundPlayers: Player[]) => {
									foundPlayers.forEach((player: Player | undefined) => {
										if (player) {
											players.push(player);
										}
									});
									resolve(players);
								})
								.catch((error) => reject(error));
						}
					}
				}
			});
		});
	}	

	//@ts-ignore
	public async findPlayer(name: string): Promise<Player> {
		return new Promise((resolve) => {
			this.client.on('text', async (packet: { type: string, message: string }) => {
				if (packet.type === 'json_whisper') {
					if (packet.message.startsWith('json ')) {
						const jsonData: { type: string, players: string[] } = JSON.parse(packet.message.replace('json ', '').replace('{"rawtext":[{"text":"', '').replace('"}]}', ''));
						if (jsonData.type === 'allPlayers') {
							const players: Player[] = (await this.getPlayers());
							const player: Player | undefined = players.find((p: Player) => p.name === name);
							if (player) resolve(player);
						}
					}
				}
			});
		});
	}

	/**
	 * Marks the client as initialized.
	 */
	private initialize() {
		this.isInitialized = true;
		this.client.on(`player_list`, (packet: { records: { type: string, records: { username: string, build_platform: number }[] } }) => {
			if (packet.records.type === `add`) {
				if (this.currentPlayerListPacket === 0) {
					packet.records.records.forEach((record: { username: string, build_platform: number }) => {
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
						const device: string = devices[record.build_platform.toString() as keyof typeof devices];
						this.setDynamicProperty(`device`, device);
					});
				}
			}
		});
		console.log("Client initialized.");
	}
}

class ActionFormData {
	private client: ScriptClient;
	private titleText: string = '';
	private bodyText: string = '';
	private buttons: { text: string; iconPath?: string }[] = [];

	constructor(client: Client) {
		this.client = new ScriptClient(client)
		return this;
	}

	/**
	 * Method that sets the body text for the modal form.
	 */
	public body(bodyText: string) {
		this.bodyText = bodyText;
		return this;
	}

	/**
	 * Adds a button to this form with an icon from a resource pack.
	 */
	public button(text: string, iconPath?: string) {
		this.buttons.push({ text, iconPath });
		return this;
	}

	/**
	 * Sets the title text for the modal form.
	 */
	public title(titleText: string) {
		this.titleText = titleText;
		return this;
	}

	/**
	 * Shows the form to a player and returns a promise that resolves with the player's response.
	 */
	public show(player: string, callback: (response: ActionFormResponse) => void) {
		const jsonData = {
			type: `ActionForm`,
			target: player,
			form: {
				title: this.titleText,
				body: this.bodyText,
				buttons: this.buttons
			},
			function: callback.toString()
		}
		this.client.sendMessage(`form ${JSON.stringify(jsonData)}`);
		return this;
	}
}

class ModalFormData {
	private client: ScriptClient;
	private titleText: string = '';
	private bodyText: string = '';
	private extras: { text?: string, minValue?: number, maxValue?: number, defaultValue?: boolean | string | number, placeHolderValue?: string, values?: [] }[] = [];

	constructor(client: Client) {
		this.client = new ScriptClient(client);
		return this;
	}

	public slider(text: string, minValue: number, maxValue: number, defaultValue: number = minValue) {
		this.extras.push({ text: text, minValue: minValue, maxValue: maxValue, defaultValue: defaultValue });
		return this;
	}

	public textField(text: string, placeHolderValue: string, defaultValue: string) {
		this.extras.push({ text: text, placeHolderValue: placeHolderValue, defaultValue: defaultValue });
		return this;
	}

	public dropdown(text: string, values: []) {
		if (values.length === 0) return;
		this.extras.push({ text: text, values: values });
		return this;
	}

	public toggle(text: string, defaultValue?: boolean) {
		this.extras.push({ text: text, defaultValue: defaultValue });
		return this;
	}

	public title(titleText: string) {
		this.titleText = titleText;
		return this;
	}

	/**
	 * Shows the form to a player and returns a promise that resolves with the player's response.
	 */
	public show(player: string, callback: (response: ModalFormResponse) => void) {
		const jsonData = {
			type: `modalForm`,
			target: player,
			form: {
				title: this.titleText,
				body: this.bodyText,
				extras: this.extras
			},
			function: callback.toString()
		}
		this.client.sendMessage(`form ${JSON.stringify(jsonData)}`);
		return this;
	}
}

class MessageFormData {
	private client: ScriptClient;
	private titleText: string = '';
	private bodyText: string = '';
	private buttons: { text: string }[] = [{ text: `` }, { text: `` }];

	constructor(client: Client) {
		this.client = new ScriptClient(client);
		return this;
	}

	public button1(text: string) {
		this.buttons[0] = {
			text: text
		}
		return this;
	}

	public button2(text: string) {
		this.buttons[1] = {
			text: text
		}
		return this;
	}

	public body(bodyText: string) {
		this.bodyText = bodyText;
		return this;
	}

	/**
	 * Sets the title text for the modal form.
	 */
	public title(titleText: string) {
		this.titleText = titleText;
		return this;
	}

	/**
	 * Shows the form to a player and returns a promise that resolves with the player's response.
	 */
	public show(player: string, callback: (response: ActionFormResponse) => void) {
		const jsonData = {
			type: `modalForm`,
			target: player,
			form: {
				title: this.titleText,
				body: this.bodyText,
				buttons: this.buttons
			},
			function: callback.toString()
		}
		this.client.sendMessage(`form ${JSON.stringify(jsonData)}`);
		return this;
	}
}

export { ScriptClient, ActionFormData, ModalFormData, MessageFormData };
/**
const client = require(`bedrock-protocol`).createClient({
	host: ip,
	port: port,
	username: ``,
	profilesFolder: `./authCache`
});
const scripts = require(`script-api-bot`);

const scriptClient = new scripts.ScriptClient(client);

function function1() {
	console.log(`d`)
}

scriptClient.setVar(`const`, `test`, `test`);
scriptClient.createFunction(function1)

scriptClient.onEvent(`beforeChatSend`, ((data) => {
	if (data.message === ``) {
	    
	}
}))
*/
