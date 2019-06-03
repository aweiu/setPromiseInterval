export declare function clearPromiseInterval(intervalId?: number): void;
export default function setPromiseInterval(handler: (...args: any[]) => Promise<any>, interval?: number): number;
