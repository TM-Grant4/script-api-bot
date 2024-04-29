const { scriptClient } = require(`./src/scriptClient.ts`);
const { Client } = require(`bedrock-protocol`);
//const client = require(`bedrock-protocol`).createClient({});

class d {
    /**
     * @param {Client} client 
     * @returns {scriptClient}
     */
    create(client) {
        if (typeof client === typeof Client) {
            return new scriptClient();
        }
    }
};