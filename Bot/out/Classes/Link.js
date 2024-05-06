import { key } from "./utils.js";
export class Link {
    client;
    key = key();
    constructor(client) {
        this.client = client;
    }
    send(type, value) {
        this.client.sendMessage(JSON.stringify({ type, value }));
    }
    async sendAsync(type, value) {
        const id = key();
        this.client.sendMessage(JSON.stringify({ type, value, id }));
        return new Promise((resolve, reject) => {
            const callback = (data) => {
                if (data.type !== "json")
                    return;
                const request = JSON.parse(JSON.parse(data.message).rawtext[0].text ?? "{}");
                if (request.key !== this.key)
                    return;
                if (request.error)
                    reject(request.error);
                else
                    resolve(request.result);
                this.client.getClient().off("text", callback);
            };
            this.client.getClient().on("text", callback);
        });
    }
}
