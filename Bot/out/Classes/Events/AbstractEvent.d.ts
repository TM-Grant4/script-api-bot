export declare abstract class Event {
    abstract subscribe(callback: (data: any) => void): (data: any) => void;
    abstract unsubscribe(callback: (data: any) => void): void;
}
