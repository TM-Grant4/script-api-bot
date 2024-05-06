export class Player {
    client;
    record;
    constructor(client, record) {
        this.client = client;
        this.record = record;
    }
    async getLocation() {
        return this.client.link.sendAsync("getPlayer", { name: this.record.username, property: "location" });
    }
}
