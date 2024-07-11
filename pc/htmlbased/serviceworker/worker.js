/**
 * @type {WebSocket}
 */
var ws = null;
const channel = new BroadcastChannel('notify');
const serviceWorkerSession = crypto.randomUUID();
var token = null;
var notificationQueue = [];
var isNotificationShowing = false;
var icon = "";
 
function connectWebSocket() {
    if (!token) {
        console.error('Token not set, unable to connect WebSocket');
        return;
    }
    
    ws = new WebSocket('wss://anemic.postr.rf.gd');
    
    ws.onopen = () => {
        console.log('Connection opened');
        ws.send(JSON.stringify({ type: 'registerWorker', session: serviceWorkerSession, token: token }));
    };

    ws.onmessage = (e) => {
        console.log('Message received: ' + e.data);
        let data = JSON.parse(e.data);
        if (data.type === 'notification') {
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: data.icon
            });
            
        }
    };

    ws.onclose = () => {
        console.log('Connection closed, reconnecting...');
        setTimeout(connectWebSocket, 5000); // Try to reconnect after 5 seconds
    };

    ws.onerror = (error) => {
        console.log('WebSocket error: ' + error.message);
        ws.close(); // Close the connection to trigger reconnect
    };
}

channel.onmessage = (e) => {
    let data = JSON.parse(e.data);
    if (data.type === 'init' && !ws) {
        console.log('Service Worker initializing with token:', data.token);
        token = data.token; 
        console.log('Service Worker initializing with token:', token);
        connectWebSocket();
    } else {
        console.log('Unknown message received:', data);
    }
};
