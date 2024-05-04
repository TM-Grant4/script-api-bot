import { EntityApplyDamageByProjectileOptions, EntityApplyDamageOptions, EntityEffectOptions, Vector3 } from "@minecraft/server";
import { ScriptClient } from "..";
import { ItemStack } from "./ItemStack";

class Player {
	private client: ScriptClient;

	/**
	 * The name of the player
	 */
	public name: string = ``;

	constructor(playerName: string, client: ScriptClient) {
		this.client = new ScriptClient(client);
		this.name = playerName;
		this.client
	}

	public addEffect(effectType: string, duration: number, options?: EntityEffectOptions) {
		const jsonData = {
			"type": "addEffect",
			"name": this.name,
			"effectType": effectType,
			"duration": duration,
			"options": options
		}
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`);
	}

	/**
	 * @param amount 
	 * @returns The current xp the player has
	 */
	public async addExperience(amount: number): Promise<any> {
		const jsonData = {
			"type": "addExperience",
			"name": this.name,
			"amount": amount
		}
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`);
		await new Promise((resolve) => {
			//@ts-ignore
			this.client.on(`text`, (packet: { type: string, message: string }) => {
				if (packet.type === `json_whisper`) {
					if (packet.message.startsWith(`json `)) {
						packet.message = packet.message.replace(`json `, ``);
						const jsonData: { type: string, value: string | number | string[] | number[] | any[] } = JSON.parse(packet.message);
						if (jsonData.type === `currentExperience`) resolve(jsonData.value);
					}
				}
			})
		})
	}

	public async addLevels(amount: number) {
		const jsonData = {
			"type": "addLevels",
			"player": this.name,
			"amount": amount
		}
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`);
		await new Promise((resolve) => {
			//@ts-ignore
			this.client.on(`text`, (packet: { type: string, message: string }) => {
				if (packet.type === `json_whisper`) {
					if (packet.message.startsWith(`json `)) {
						packet.message = packet.message.replace(`json `, ``);
						const jsonData: { type: string, value: string | number | string[] | number[] | any[] } = JSON.parse(packet.message);

						if (jsonData.type === `currentXPLevel`) return jsonData.value;
					}
				}
			})
		})
	}

	public addTag(tag: string) {
		const jsonData = {
			"type": "addTag",
			"player": this.name,
			"tag": tag
		}
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`);
	}

	public applyDamage(amount: number, options?: EntityApplyDamageOptions | EntityApplyDamageByProjectileOptions) {
		const jsonData = {
			"type": "addTag",
			"player": this.name,
			"amount": amount,
			"options": options
		}
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`)
	}

	public applyImpulse(vector: Vector3) {
		const jsonData = {
			"type": "applyImpulse",
			"player": this.name,
			"vector": vector
		}
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`)
	}
	public applyKnockback(directionX: number, directionZ: number, horizontalStrength: number, verticalStrength: number) {
		const jsonData = {
			"type": "applyKnockback",
			"player": this.name,
			"directionX": directionX,
			"directionZ": directionZ,
			"horizontalStrength": horizontalStrength,
			"verticalStrength": verticalStrength
		}
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`)
	}

	public clearDynamicProperties() {
		const jsonData = {
			"type": "clearDynamicProperties",
			"player": this.name,
		}
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`)
	}

	public clearVelocity(): void {
		const jsonData = {
			type: `clearVelocity`,
			name: this.name,
		}
		this.sendMessage(`player ${JSON.stringify(jsonData)}`);
	}

	public eatItem(itemStack: ItemStack): void {
		const jsonData = {
			type: `eatItem`,
			name: this.name,
			item: itemStack
		}
		this.sendMessage(`player ${JSON.stringify(jsonData)}`);
	}

	public async extinguishFire(useEffects?: boolean): Promise<boolean> {
		const jsonData = {
			"type": "extinguishFire",
			"player": this.name,
			"useEffects": useEffects
		};
		this.client.sendMessage(`player ${JSON.stringify(jsonData)}`);
		
		return new Promise<boolean>((resolve) => {
			//@ts-ignore
			this.client.on(`text`, (packet: { type: string, message: string }) => {
				if (packet.type === `json_whisper`) {
					if (packet.message.startsWith(`json `)) {
						packet.message = packet.message.replace(`json `, ``);
						const jsonData: { type: string, value: boolean } = JSON.parse(packet.message);
						if (jsonData.type === `extinguishFireResult`) resolve(jsonData.value);
					}
				}
			});
		});
	}
	
    
	public sendMessage(message: string) {
		this.client.sendCommand(`tellraw ${this.name} {"rawtext":[{"text":"${message}"}]}`)
	}

	/**
	 * @param property the name of the property to set 
	 * @param value the value to set the property to
	 */
	public setDynamicProperty(property: string, value: string | number | string[] | number[]): void {
		const jsonData = {
			type: `setDynamicProperty`,
			name: this.name,
			property: property,
			value: value
		}
		this.sendMessage(`player ${JSON.stringify(jsonData)}`);
	}

	public async getDynamicProperty(name: string, property: string) {
		const jsonData = {
			name: name,
			property: property
		};
		this.sendMessage(`getDynamicProperty ${JSON.stringify(jsonData)}`);
		await new Promise((resolve) => {
			//@ts-ignore
			this.client.on(`text`, (packet: { type: string, message: string }) => {
				if (packet.type === `json_whisper`) {
					if (packet.message.startsWith(`json `)) {
						packet.message = packet.message.replace(`json `, ``);
						const jsonData: { type: string, value: string | number | string[] | number[] | any[] } = JSON.parse(packet.message);
						if (jsonData.type === `playerDynamicProperty`) {
							resolve(jsonData.value);
						}
					}
				}
			});
		});

	}
}

export { Player };