import { BlockExplodeAfterEvent, ButtonPushAfterEvent, ChatSendAfterEvent, ChatSendBeforeEvent, DataDrivenEntityTriggerAfterEvent, EffectAddAfterEvent, EffectAddBeforeEvent, EntityDieAfterEvent, EntityHealthChangedAfterEvent, EntityHitBlockAfterEvent, EntityHitEntityAfterEvent, EntityHurtAfterEvent, EntityLoadAfterEvent, EntityRemoveAfterEvent, EntityRemoveBeforeEvent, EntitySpawnAfterEvent, ExplosionAfterEvent, ExplosionBeforeEvent, GameRuleChangeAfterEvent, ItemCompleteUseAfterEvent, ItemReleaseUseAfterEvent, ItemStartUseAfterEvent, ItemStartUseOnAfterEvent, ItemStopUseAfterEvent, ItemStopUseOnAfterEvent, ItemUseAfterEvent, ItemUseOnAfterEvent, ItemUseOnBeforeEvent, LeverActionAfterEvent, PistonActivateAfterEvent, PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, PlayerDimensionChangeAfterEvent, PlayerGameModeChangeAfterEvent, PlayerGameModeChangeBeforeEvent, PlayerInteractWithBlockAfterEvent, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityAfterEvent, PlayerInteractWithEntityBeforeEvent, PlayerJoinAfterEvent, PlayerLeaveAfterEvent, PlayerLeaveBeforeEvent, PlayerPlaceBlockAfterEvent, PlayerPlaceBlockBeforeEvent, PlayerSpawnAfterEvent, PressurePlatePopAfterEvent, PressurePlatePushAfterEvent, ProjectileHitBlockAfterEvent, ProjectileHitEntityAfterEvent, TargetBlockHitAfterEvent, TripWireTripAfterEvent, WatchdogTerminateBeforeEvent, WeatherChangeAfterEvent, WeatherChangeBeforeEvent, WorldInitializeAfterEvent } from "@minecraft/server";
import { Client, createClient, ClientStatus } from "bedrock-protocol";

interface ActionFormResponse {
    selection: number;
}

interface ModalFormResponse {
    formValues: (number | string)[] | string[] | number[];
}

type Events = {
    beforeChatSend: ChatSendBeforeEvent;
    beforeEffectAdd: EffectAddBeforeEvent;
    beforeExplosion: ExplosionBeforeEvent;
    beforeItemUse: ItemUseOnBeforeEvent;
    beforeItemUseOn: ItemUseOnBeforeEvent;
    beforePlayerLeave: PlayerLeaveBeforeEvent;
    beforeEntityLeave: EntityRemoveBeforeEvent;
    beforeWeatherChange: WeatherChangeBeforeEvent;
    beforeBreakBlock: PlayerBreakBlockBeforeEvent;
    beforePlaceBlock: PlayerPlaceBlockBeforeEvent;
    beforeWatchdogTerminate: WatchdogTerminateBeforeEvent;
    beforePlayerGameModeChange: PlayerGameModeChangeBeforeEvent;
    beforePlayerInteractWithBlock: PlayerInteractWithBlockBeforeEvent;
    beforePlayerInteractWithEntity: PlayerInteractWithEntityBeforeEvent;
    afterItemUse: ItemUseAfterEvent;
    afterChatSend: ChatSendAfterEvent;
    afterEffectAdd: EffectAddAfterEvent;
    afterEntityDie: EntityDieAfterEvent;
    afterExplosion: ExplosionAfterEvent;
    afterItemUseOn: ItemUseOnAfterEvent;
    afterButtonPush: ButtonPushAfterEvent;
    afterEntityHurt: EntityHurtAfterEvent;
    afterEntityLoad: EntityLoadAfterEvent;
    afterPlayerJoin: PlayerJoinAfterEvent;
    afterEntitySpawn: EntitySpawnAfterEvent;
    afterItemStopUse: ItemStopUseAfterEvent;
    afterLeverAction: LeverActionAfterEvent;
    afterPlayerLeave: PlayerLeaveAfterEvent;
    afterPlayerSpawn: PlayerSpawnAfterEvent;
    afterBlockExplode: BlockExplodeAfterEvent;
    afterEntityRemove: EntityRemoveAfterEvent;
    afterPlayerInteractWithEntity: PlayerInteractWithEntityAfterEvent;
    afterPlayerInteractWithBlock: PlayerInteractWithBlockAfterEvent;
    afterDataDrivenEntityTrigger: DataDrivenEntityTriggerAfterEvent;
    afterPlayerDimensionChange: PlayerDimensionChangeAfterEvent;
    afterPlayerGameModeChange: PlayerGameModeChangeAfterEvent;
    afterProjectileHitEntity: ProjectileHitEntityAfterEvent;
    afterEntityHealthChanged: EntityHealthChangedAfterEvent;
    afterProjectileHitBlock: ProjectileHitBlockAfterEvent;
    afterPressurePlatePush: PressurePlatePushAfterEvent;
    afterPressurePlatePop: PressurePlatePopAfterEvent;
    afterPlayerPlaceBlock: PlayerPlaceBlockAfterEvent;
    afterPlayerBreakBlock: PlayerBreakBlockAfterEvent;
    afterItemCompleteUse: ItemCompleteUseAfterEvent;
    afterEntityHitEntity: EntityHitEntityAfterEvent;
    afterTargetBlockHit: TargetBlockHitAfterEvent;
    afterPistonActivate: PistonActivateAfterEvent;
    afterItemStartUseOn: ItemStartUseOnAfterEvent;
    afterItemReleaseUse: ItemReleaseUseAfterEvent;
    afterGameRuleChange: GameRuleChangeAfterEvent;
    afterEntityHitBlock: EntityHitBlockAfterEvent;
    afterWeatherChange: WeatherChangeAfterEvent;
    afterItemStopUseOn: ItemStopUseOnAfterEvent;
    afterTripWireTrip: TripWireTripAfterEvent;
    afterItemStartUse: ItemStartUseAfterEvent;
};

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
    private client: Client;
    private currentPlayerListPacket: number = 0;

    constructor(client: Client) {
        //@ts-ignore
        super(client);
        this.client = client;
        setInterval(() => {
            if (client.status === ClientStatus.Initialized) {
                this.initialize();
                return this;
            }
        }, 500);
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

            this.write('text', {
                type: 'chat',
                needs_translation: false,
                source_name: `i.am.grant`,
                xuid: '',
                platform_chat_id: '',
                message: `addListener ${JSON.stringify(jsonData)}`
            });
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
     * function d() {
     *     console.log(`hello`)
     * }
     * console.log(d());
     * ```
     */
    public createFunction(functionString: string) {
        this.functions.push(functionString);
        return this;
    }
    public sendMessage(message) {
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
    public setDynamicProperty(name: string, property: string, value: string | number | string[] | number[]) {
        const jsonData = {
            type: `player`,
            name: name,
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
        this.on(`text`, (packet) => {

        })
    }

    public getPlayers() {
        this.sendMessage(`getAllPlayers`);
        this.on(`text`, (packet) => {
            if (packet.type === `json`) {
                if (packet.message.startsWith(`json `).replace(`json `, ``)) {

                    const jsonData = JSON.parse(packet.message.replace(`{"rawtext":[{"text":"`, ``).replace(`"}]}`, ``));
                    if (jsonData.type === `allPlayers`) {
                        return jsonData.players;
                    }
                }
            }
        })
    }

    /**
     * Marks the client as initialized.
     */
    private initialize() {
        this.isInitialized = true;
        client.on(`player_list`, (packet) => {
            if (packet.records.type === `add`) {
                if (this.currentPlayerListPacket === 0) {
                    packet.records.records.forEach((record) => {
                        const devices = {
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
                        const device = devices[record.build_platform];
                        this.setDynamicProperty(`${record.username}`, `device`, device);
                    });
                }
            }
        })
        console.log("Client initialized.");
    }
}

class ActionFormData {
    private client: ScriptClient;
    private titleText: string = '';
    private bodyText: string = '';
    private buttons: { text: string; iconPath?: string }[] = [];

    constructor(client: Client) {
        this.client = client
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
        this.client.write('text', {
            type: 'chat',
            needs_translation: false,
            source_name: `i.am.grant`,
            xuid: '',
            platform_chat_id: '',
            message: `form ${JSON.stringify(jsonData)}`
        });
        return this;
    }
}

class ModalFormData {
    private client: ScriptClient;
    private titleText: string = '';
    private bodyText: string = '';
    private extras: { text?: string, minValue?: number, maxValue?: number, defaultValue?: boolean | string | number, placeHolderValue?: string, values?: [] }[] = [];

    constructor(client: Client) {
        this.client = client;
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
        this.client.write('text', {
            type: 'chat',
            needs_translation: false,
            source_name: `i.am.grant`,
            xuid: '',
            platform_chat_id: '',
            message: `form ${JSON.stringify(jsonData)}`
        });
        return this;
    }
}

class MessageFormData {
    private client: ScriptClient;
    private titleText: string = '';
    private bodyText: string = '';
    private buttons: { text: string }[] = [{ text: `` }, { text: `` }];

    constructor(client: Client) {
        this.client = client;
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
        this.client.write('text', {
            type: 'chat',
            needs_translation: false,
            source_name: `i.am.grant`,
            xuid: '',
            platform_chat_id: '',
            message: `form ${JSON.stringify(jsonData)}`
        });
        return this;
    }
}

export { ScriptClient, ActionFormData, ModalFormData, MessageFormData };

import * as bedrock from "bedrock-protocol";
const client = bedrock.createClient({
    host: ``,
    port: 0,
    username: ``
})

const clientt = new ScriptClient(client);

clientt.onEvent(`afterBlockExplode`, ((d) => { }))