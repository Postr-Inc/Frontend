
import WebSocket from "ws";
import EventSource from "eventsource";
global.EventSource = EventSource;
const  subscribeOptions =  {
    event:{
        getPosts: "",
        getPost:  "",
        TimelineUpdate:   "",
        UserProfileChange:  "",
        PostEdited: "",
        PostDeleted:  "",
        PostLiked:  "",
        PostUnliked:    ""
    }
}
export default class TweeterCJS {
    
    constructor(options= { token: ""}){
        this.token = options.token;
        this.ws = new WebSocket("ws://localhost:8080");
        this.sendMessage = (message)=>{
            this.WaitForSocketConnection(()=> {
                this.ws.send(message);
            });
        }
        this.callbacks = new Map();
        this.events = new Map();
        this.ws.onmessage = (e)=> this.handleSocketMessage(e.data);
        this.ws.onopen = ()=> this.onConnection(this.ws);
    }


     onConnection = (ws) =>{
        console.log("connected")
    }
     subscribe = (event = subscribeOptions, callback)=>{
        let key = crypto.randomUUID()
        return new Promise((resolve, reject)=>{
            this.callbacks.set(key, (data)=>{
                if(data.error) reject(new Error(data.message));
                callback ? callback(data) : resolve(data);
            })
            this.sendMessage(JSON.stringify({type: "subscribe", event:event, token: this.token, key: key}))
        })
    }

   getUserByUsername  (username , callback ){
        let key = crypto.randomUUID()
         return new Promise((resolve, reject)=>{
            this.callbacks.set(key, (data)=>{
                if(data.error) reject(new Error(data.message));
                callback ? callback(data) : resolve(data);
            })
            this.sendMessage(JSON.stringify({ server:true,  type: "getUserByUsername", username:username, token: this.token, key: key}))
         })
    }
     WaitForSocketConnection = (callback) =>{
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

   handleSocketMessage = (msg)=>{
        let data = JSON.parse(msg);
        if(data.server){
            let callback = this.callbacks.get(data.key);
            callback  ? callback(data) : null;
        }
    }
   
}


let client = new TweeterCJS({ token: "token"});

client.getUserByUsername("malik", (data)=>{
    console.log(data)
})
 

client.subscribe({event: "getPosts"}, (data)=>{
    console.log(data)
})