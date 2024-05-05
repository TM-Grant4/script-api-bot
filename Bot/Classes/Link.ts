import Crypto from "crypto"
import { ScriptClient } from "../index.js";

export class Link {

    protected key = key()
    public linked = false
    private requests: Record<string, { resolve: (...args: any) => void, reject: (...args: any) => void }> = {}

    constructor(private readonly client: ScriptClient) {
        client.getClient().on("text", (data) => {
            if (data.type !== "json") return
            const request = JSON.parse(data.message).rawtext[0].text
            if (!request || request.key !== this.key) return
            const requestData = this.requests[request.id]
            if (request.error) requestData.reject(request.error)
            else requestData.resolve(request.result)
            delete this.requests[request.id]
        })
    }

    public send(type: string, value: any) {
        this.client.sendMessage(JSON.stringify({ type, value }))
    }

    public async sendAsync(type: string, value: any) {
        const id = key()
        this.client.sendMessage(JSON.stringify({ type, value, id }))
        return new Promise<any>((resolve, reject) => {
            this.requests[id] = { resolve, reject }
        })
    }

    public async onLinked() {
        if (this.linked) return Promise.resolve()
        await this.client.onClientJoin()
        return this.sendAsync("key", this.key)
    }
}

const key = () => Crypto.randomBytes(8).toString("base64")