import { postrSdk } from "../sdk/postrSDK";
export const api: any = new postrSdk({
    wsUrl: "localhost:8080",
    pbUrl: "https://bird-meet-rationally.ngrok-free.app",
    cancellation: true
});