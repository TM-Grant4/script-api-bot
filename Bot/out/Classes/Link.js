import Crypto from "crypto";
export class Link {
    client;
    key = key();
    linked = false;
    requests = {};
    constructor(client) {
        this.client = client;
        client.getClient().on("text", (data) => {
            if (data.type !== "json")
                return;
            const request = JSON.parse(data.message).rawtext[0].text;
            if (!request || request.key !== this.key)
                return;
            const requestData = this.requests[request.id];
            if (request.error)
                requestData.reject(request.error);
            else
                requestData.resolve(request.result);
            delete this.requests[request.id];
        });
    }
    send(type, value) {
        this.client.sendMessage(JSON.stringify({ type, value }));
    }
    async sendAsync(type, value) {
        const id = key();
        this.client.sendMessage(JSON.stringify({ type, value, id }));
        return new Promise((resolve, reject) => {
            this.requests[id] = { resolve, reject };
        });
    }
    async onLinked() {
        if (this.linked)
            return Promise.resolve();
        await this.client.onClientJoin();
        return this.sendAsync("key", this.key);
    }
}
const key = () => Crypto.randomBytes(8).toString("base64");
