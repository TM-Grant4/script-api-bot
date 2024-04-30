import { BlockExplodeAfterEvent, ButtonPushAfterEvent, ChatSendAfterEvent, ChatSendBeforeEvent, DataDrivenEntityTriggerAfterEvent, EffectAddAfterEvent, EffectAddBeforeEvent, EntityDieAfterEvent, EntityHealthChangedAfterEvent, EntityHitBlockAfterEvent, EntityHitEntityAfterEvent, EntityHurtAfterEvent, EntityLoadAfterEvent, EntityRemoveAfterEvent, EntityRemoveBeforeEvent, EntitySpawnAfterEvent, ExplosionAfterEvent, ExplosionBeforeEvent, GameRuleChangeAfterEvent, ItemCompleteUseAfterEvent, ItemReleaseUseAfterEvent, ItemStartUseAfterEvent, ItemStartUseOnAfterEvent, ItemStopUseAfterEvent, ItemStopUseOnAfterEvent, ItemUseAfterEvent, ItemUseOnAfterEvent, ItemUseOnBeforeEvent, LeverActionAfterEvent, PistonActivateAfterEvent, PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, PlayerDimensionChangeAfterEvent, PlayerGameModeChangeAfterEvent, PlayerGameModeChangeBeforeEvent, PlayerInteractWithBlockAfterEvent, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityAfterEvent, PlayerInteractWithEntityBeforeEvent, PlayerJoinAfterEvent, PlayerLeaveAfterEvent, PlayerLeaveBeforeEvent, PlayerPlaceBlockAfterEvent, PlayerPlaceBlockBeforeEvent, PlayerSpawnAfterEvent, PressurePlatePopAfterEvent, PressurePlatePushAfterEvent, ProjectileHitBlockAfterEvent, ProjectileHitEntityAfterEvent, TargetBlockHitAfterEvent, TripWireTripAfterEvent, WatchdogTerminateBeforeEvent, WeatherChangeAfterEvent, WeatherChangeBeforeEvent, WorldInitializeAfterEvent } from "@minecraft/server";
import { Client, createClient, ClientStatus } from "bedrock-protocol";

interface ActionFormResponse {
    selection: number;
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

    constructor(client: Client) {
        //@ts-ignore
        super(client);
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
    public onGame<K extends keyof Events>(event: K, callback: (event: Events[K]) => void) {
        if (this.isInitialized) {
            const jsonData: { type: string, function: string } = {
                type: `${event}`,
                function: callback.toString()
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
            return setTimeout(() => {
                this.onGame(event, callback)
            }, 5000);
        }
    }

    /**
     * Marks the client as initialized.
     */
    private initialize() {
        this.isInitialized = true;
        console.log("Client initialized.");
    }
}


class ActionFormData {
    private client;
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
        this.client('text', {
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
    private client;
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
    public show(player: string, callback: (response: ActionFormResponse) => void) {
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
        this.client('text', {
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
    private client;
    private titleText: string = '';
    private bodyText: string = '';
    private buttons: { text: string }[] = [{text: ``},{text: ``}];

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
        this.client('text', {
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