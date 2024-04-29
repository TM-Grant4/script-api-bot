import { BlockExplodeAfterEvent, ButtonPushAfterEvent, ChatSendAfterEvent, ChatSendBeforeEvent, DataDrivenEntityTriggerAfterEvent, EffectAddAfterEvent, EffectAddBeforeEvent, EntityDieAfterEvent, EntityHealthChangedAfterEvent, EntityHitBlockAfterEvent, EntityHitEntityAfterEvent, EntityHurtAfterEvent, EntityLoadAfterEvent, EntityRemoveAfterEvent, EntityRemoveBeforeEvent, EntitySpawnAfterEvent, ExplosionAfterEvent, ExplosionBeforeEvent, GameRuleChangeAfterEvent, ItemCompleteUseAfterEvent, ItemReleaseUseAfterEvent, ItemStartUseAfterEvent, ItemStartUseOnAfterEvent, ItemStopUseAfterEvent, ItemStopUseOnAfterEvent, ItemUseAfterEvent, ItemUseOnAfterEvent, ItemUseOnBeforeEvent, LeverActionAfterEvent, PistonActivateAfterEvent, PlayerBreakBlockAfterEvent, PlayerBreakBlockBeforeEvent, PlayerDimensionChangeAfterEvent, PlayerGameModeChangeAfterEvent, PlayerGameModeChangeBeforeEvent, PlayerInteractWithBlockAfterEvent, PlayerInteractWithBlockBeforeEvent, PlayerInteractWithEntityAfterEvent, PlayerInteractWithEntityBeforeEvent, PlayerJoinAfterEvent, PlayerLeaveAfterEvent, PlayerLeaveBeforeEvent, PlayerPlaceBlockAfterEvent, PlayerPlaceBlockBeforeEvent, PlayerSpawnAfterEvent, PressurePlatePopAfterEvent, PressurePlatePushAfterEvent, ProjectileHitBlockAfterEvent, ProjectileHitEntityAfterEvent, ServerMessageAfterEvent, TargetBlockHitAfterEvent, TripWireTripAfterEvent, WatchdogTerminateBeforeEvent, WeatherChangeAfterEvent, WeatherChangeBeforeEvent, WorldInitializeAfterEvent } from "@minecraft/server";
import { Client, ClientStatus } from "bedrock-protocol";

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
    afterServerMessage: ServerMessageAfterEvent;
    afterItemStopUseOn: ItemStopUseOnAfterEvent;
    afterTripWireTrip: TripWireTripAfterEvent;
    afterItemStartUse: ItemStartUseAfterEvent;
};

class ScriptClient extends Client {
    private isInitialized: boolean = false;

    constructor(client: Client) {
        super(client);
        setInterval(() => {
            if (client.status === ClientStatus.Initialized) this.initialize();
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
                source_name: `i am a Bot`,
                xuid: '',
                platform_chat_id: '',
                message: `addListener ${JSON.stringify(jsonData)}`
            });
        } else {
            console.log("Client is not yet initialized. Event registration will rerun once initialized");
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

export default ScriptClient;

const client = new ScriptClient();

client.onGame(`beforeChatSend`, ((event) => {
    if (event === ``) {

    }
});