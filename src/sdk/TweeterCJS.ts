export default class TweeterCJS {
    token: string;
    ws: WebSocket;
    events: Map<string, Function>;
    sendMessage: Function;
    callbacks: Map<string, Function>;
    constructor(options: { token: string}){
        this.token = options.token;
        this.ws = new WebSocket("ws://localhost:8080");
        this.sendMessage = (message: string)=>{
            this.WaitForSocketConnection(()=> {
                this.ws.send(message);
            });
        }
        this.callbacks = new Map();
        this.events = new Map();
        this.ws.onmessage = (e)=> this.handleSocketMessage(e.data);
    }

    public on: Function = (event: string, callback: Function)=>{
         !this.events.has(event) ? this.events.set(event, (data:any)=>{
            callback(data);
            
         })  :  null
        
    }
    private WaitForSocketConnection: Function = (callback: Function)=>{
        let timer = setTimeout(  ()=> {
                if (this.ws.readyState === 1) {
                    if (callback != null){
                        callback();
                        clearTimeout(timer);
                    }
                    return;

                } else {
                    this.WaitForSocketConnection(callback);
                    clearTimeout(timer);
                }

            }, 5); // wait 5 milisecond for the connection...
    }

    private handleSocketMessage: Function = (msg: string)=>{
        console.log(msg)
    }
    public getUser: Function = (identifier: string, callback: Function)=>{
          return new Promise((resolve, reject)=>{
            let key = crypto.randomUUID()

            this.callbacks.set(key, (data: any)=>{
                if(data.error) reject(new Error(data.message));
                resolve(data);
            })
            this.sendMessage(JSON.stringify({ server:true,  type: "getUser", identifier, key, token: this.token}))
          })
    }
}


let client = new TweeterCJS({ token: "token"});


client.on("post", (data: any)=>{
    console.log(data)
})

client.getUser({username:'malik'}).then((data: any)=>{
    console.log(data)
}).catch((e: Error)=>{
    console.log(e)
})
 