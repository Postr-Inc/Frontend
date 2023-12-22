import { Metadata, ResolvingMetadata } from "next"; 

// todo: add a way to get metadata for a record on db - this needs to be authenticated by token instead of session due to spamming
/**
 * class gateway {
    ws: WebSocket
    callbacks: Map<string, Function>
    sessionID: string
    constructor(){
      this.ws = new WebSocket("ws://localhost:8080");
      this.ws.onopen = () => {
        console.log("connected");
        this.send({type: "authSession", session: this.sessionID})
      };
      this.callbacks  = new Map();
      this.sessionID = crypto.randomUUID();
    }

    async send(data: any){
        this.waitForSocketConnection(() => {
            this.ws.send(JSON.stringify(data));
        }, 1000);
    }

    waitForSocketConnection(callback: Function, interval: number) {
        setTimeout(
            ()=> {
                if (this.ws.readyState === 1) {
                    console.log("Connection is made")
                    if (callback != null){
                        callback();
                    }
                    return;
                } else {
                    console.log("wait for connection...")
                    this.waitForSocketConnection(callback, interval);
                }
            }, interval);
    }
    async close(){
        this.ws.close();
    }
    async message(data: any){
         
        switch (data.type) {
            case "read":
                let callback = this.callbacks.get(data.key);
                if(callback){ callback(data.data)}
                break;
        
            default:
                break;
        }
    }
    list(record:{filter: string, collection: string}, callback: Function, offset: number = 0, limit: number = 1){
        let key = crypto.randomUUID();
        this.callbacks.set(key, callback);
        
        this.send({type: "list", data:record, key, session: this.sessionID});
    
    }  
}

let gatewayInstance = new gateway();
 
 
type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }

export  async function generateMetadata({props, searchParams}: Props, Parent:ResolvingMetadata):  Metadata {
    let url = searchParams.url

    switch (true) {
       case url == "/u": 
           gatewayInstance.list({collection: "users", filter:`username="${searchParams.id}"`}, (data: any) => {
               console.log(data);
           })
       break;
    }
}  

export default  function page({props, searchParams}: Props){
     
}
 */