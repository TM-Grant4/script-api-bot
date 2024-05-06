import { ScriptClient } from "../index.js";
import { key } from "./utils.js";

export class Link {

    protected key = key()

    constructor(private readonly client: ScriptClient) { }

    public send(type: string, value: any) {
        this.client.sendMessage(JSON.stringify({ type, value }))
    }

    public async sendAsync(type: string, value: any) {
        const id = key()
        this.client.sendMessage(JSON.stringify({ type, value, id }))
        return new Promise<any>((resolve, reject) => {
            const callback = (data) => {
                if (data.type !== "json") return
                const request = JSON.parse(JSON.parse(data.message).rawtext[0].text ?? "{}")
                if (request.key !== this.key) return
                if (request.error) reject(request.error)
                else resolve(request.result)
                this.client.getClient().off("text", callback)
            }
            this.client.getClient().on("text", callback)
        })
    }
}
