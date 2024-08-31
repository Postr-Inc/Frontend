import useCache from "../Hooks/useCache";
import isTokenExpired from "./jwt";
import { HttpCodes } from "./opCodes";
import { authStore } from "./Types/AuthStore";
import { GeneralTypes } from "./Types/GeneralTypes";
const ip = null;
 
export default class SDK {
  serverURL: string;
  hasChecked = false;
  ip = "";
  changeEvent: CustomEvent;
  ws: WebSocket | null = null;
  statisticalData: any[];
  callbacks: Map<string, (data: any) => void>;
  constructor(data: { serverURL: string }) {
    this.serverURL = data.serverURL;
    this.ip = sessionStorage.getItem("ip") as string;
    this.callbacks = new Map();
    this.changeEvent = new CustomEvent("authChange");
    /**
     * @description data metrics used to track user activity - this is stored locally
     */
    this.statisticalData = JSON.parse(localStorage.getItem("postr_statistical") || "{}");
    if (localStorage.getItem("postr_auth")) {
      this.connect()
    }
    window.onbeforeunload = () => {
      localStorage.setItem("postr_statistical", JSON.stringify(this.statisticalData));
    }
  }

  on = (type: "authChange" | string, cb: (data: any) => void) => {
    window.addEventListener(type, (event) => {
      cb(event);
    });
  };

  connect = async () => { 
    if(!this.ip){
      await this.getIP();
    } 
    const isHTTP =
      this.serverURL.includes("http://") ||
      this.serverURL.includes("localhost") ||
      this.serverURL.includes("127.0.0.1");
    const wsUrl = isHTTP
      ? this.serverURL.replace("http", "ws")
      : this.serverURL.replace("https", "wss");
    document.cookie = `Authorization=${this.authStore.model.token}; path=/; SameSite=Lax; Secure`;
    document.cookie = `ipAddress=${this.ip}; path=/; SameSite=Lax; Secure`;

    // first check if token is valid
    if(localStorage.getItem("postr_auth") && !this.hasChecked){
      let res = await fetch(`${this.serverURL}/auth/verify`, {
        headers: {
          Authorization: this.authStore.model.token,
        },
      });
      this.hasChecked = true;
      if (res.status !== 200) {
        console.log("Token invalid, reauthenticating");
        localStorage.removeItem("postr_auth"); 
        window.location.href = "/auth/login"
        return;
      }
    }else{ 
        window.location.href = "/auth/login"
    }
     
    this.ws = new WebSocket(wsUrl + "/ws");

    this.ws.onopen = () => {
      console.log("Connected to server");
    };
    this.ws.onmessage = (event) => {
      this.handleMessages(event.data);
    };
    let reConnect = () => {
      setTimeout(() => {
        this.ws?.close();
        this.ws = new WebSocket(wsUrl);
      }, 5000);
    };

    this.ws.onclose = () => {
      console.log("Connection closed");
      reConnect();
    };
    this.ws.onerror = () => {
      console.log("Error connecting to server");
      reConnect();
    };
  };

  handleMessages = (data: any) => {
    let _data = JSON.parse(data); 
    let cb = this.callbacks.get(_data.callback);
    if (cb) {
      cb(_data);
    }
  };


  authStore: authStore = {
    model: JSON.parse(localStorage.getItem("postr_auth") || "{}"),
    isValid: () => {
      if (!this.authStore.model.token) return false;
      return isTokenExpired(this.authStore.model.token) ? false : true;
    },
    logout: () => {
      localStorage.removeItem("postr_auth");
      window.dispatchEvent(this.changeEvent);
      if(window.location.pathname !== "/auth/login") window.location.href = "/auth/login";
    },
    login: async (emailOrUsername: string, password: string) => {
      return new Promise(async (resolve, reject) => {
        if(emailOrUsername === "" || password === "" || !emailOrUsername || !password || emailOrUsername.length < 3 || password.length < 3) {
          reject("Invalid email or password")
          return;
        }
        const response = await fetch(`${this.serverURL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            emailOrUsername,
            password,
            ipAddress: this.ip,
            deviceInfo: navigator.userAgent,
          }),
        });
        console.log(response);
        const { data, status, message } = await response.json();
        if (status !== 200)  return reject(message);
        this.authStore.model = data;
        localStorage.setItem("postr_auth", JSON.stringify(data)); 
        return resolve(data);
        
      })
    },
  };
  async getIP() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      this.ip = data.ip;
    } catch (error) {
      console.error(error);
    }
  }

  cdn = {
    getUrl: (collection: string, id: string, file: string) => {
      return this.serverURL + `/api/files/${collection}/${id}/${file}`;
    },
  };

  async waitUntilConnected() {
    // with infinite loop
    while (this.ws?.readyState !== WebSocket.OPEN) {
      console.log("Waiting for connection");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  sendMsg = async (msg: any) => {
    await this.waitUntilConnected(); 
    this.ws?.send(JSON.stringify(msg));
  };

  callback(cb: (data: any) => void) {
    const id = Math.random().toString(36).substring(7);
    const cleanup = () => {
      this.callbacks.delete(id);
    };
    this.callbacks.set(id, (data: any) => {
      cb(data);
      cleanup();
    });
    return id;
  }

  /**
   * @method collection
   * @description use methods to interact with a collection
   * @param name  name of the collection
   * @returns  {
   * {list: (page: number, limit: number, options: { order: "asc" | "dec", sort: string, expand: string[]}, shouldCache: boolean) => Promise<any>},
   * {create: (data: any) => Promise<any>},
   * {update: (id: string, data: any) => Promise<any>},
   * {delete: (id: string) => Promise<any>}
   * }
   */
  public collection(name: string) {
    return {
      /**
       * @method subscribe
       * @description subscribe to a collection
       * @param id
       * @param options
       * @returns {Promise<any>}
       */
      subscribe: async (id: "*" | string, options: { cb: (data: any) => void }) => {
        return new Promise(async (resolve, reject) => {
          let cb = this.callback((data) => {
            if (data.opCode !== HttpCodes.OK) return reject(data);
            options.cb(data.payload);
          });
          this.sendMsg({
            type: GeneralTypes.SUBSCRIBE,
            payload: {
              collection: name,
              id,
              options,
            },
            security: {
              token: this.authStore.model.token,
            },
            callback: cb,
          });
        })
      },
      /**
       * @method list
       * @description list all records in a collection with pagination
       * @param page
       * @param limit
       * @param options
       * @param shouldCache
       * @returns {Promise<any>}
       */
      list: async (
        page: number = 1,
        limit: number = 10,
        options?: {
          order?: "asc" | "dec" | any;
          sort?: string;
          expand?: string[];
          recommended?: boolean;
          filter?: string;
          cacheKey?: string;
        },
        shouldCache = true
      ) => {
        return new Promise(async (resolve, reject) => {
          const { set, get, remove, clear } = useCache();
          const cacheKey = options?.cacheKey || `${this.serverURL}/api/collections/${name}?page=${page}&limit=${limit}`; 
          const cacheData = shouldCache ?  await get(cacheKey) : null; 
          if (cacheData) return resolve({opCode: HttpCodes.OK, 
             ...(Array.isArray(cacheData) ? {items: [...cacheData]} : {items: [cacheData.payload]}), totalItems: cacheData.totalItems, totalPages: cacheData.totalPages});
          let cb = this.callback((data) => {
            shouldCache && set(cacheKey, data.payload,  new Date().getTime() + 3600); // cache for 1 hour
            resolve({
              opCode: data.opCode,
              items: data.payload,
              totalItems: data.totalItems,
              totalPages: data.totalPages,
              cacheKey
            }) as any;
          });
          this.sendMsg({
            type: GeneralTypes.LIST,
            payload: {
              collection: name,
              page,
              limit,
              options,
            },
            security: {
              token: this.authStore.model.token,
            },
            callback: cb,
          });
        });
      },
      /**
       * @method update
       * @description Update a record in a collection
       * @param id
       * @param data
       */

       update: async (id: string, data: any, options?: {cacheKey?: string, expand?:any[]}) => {
        return new Promise(async (resolve, reject)=> {
            // update cache
            const { set, get, remove, clear } = useCache();
            const keys = await caches.keys(); 
            for(let key of keys){
                const cacheData = await (await caches.open(key)).keys(); 
                switch(name){
                  case "posts":
                    for(let cache of cacheData){ 
                        if(cache.url.includes(`${this.serverURL}/api/collections/${name}`)){
                            // now grab the data
                            const cacheDataJSON = await (await caches.open(key)).match(cache).then((res)=> res?.json());
                            console.log(cacheDataJSON)
                            if(Array.isArray(cacheDataJSON.value.payload)){
                                const payload = cacheDataJSON.value.payload;
                                const post = payload.find((e: any)=> e.id === id);
                                if(post){
                                    const index = payload.indexOf(post);
                                    payload[index] = {...post, ...data}
                                    cacheDataJSON.payload = payload;
                                }
                                set(cache.url, cacheDataJSON.value, new Date().getTime() + 3600);
                            }else{
                                const post = cacheDataJSON.value.payload;
                                if(post.id === id){
                                    cacheDataJSON.value.payload = {...post, ...data}
                                    set(cache.url, cacheDataJSON.value, new Date().getTime() + 3600);
                                }
                            }
                           
                        }
                    }
                    
                    break;
                  case "users":
                    for(let cache of cacheData){ 
                      if(cache.url.includes(options?.cacheKey as any)){
                          // now grab the data
                          var cacheDataJSON = await (await caches.open(key)).match(cache).then((res)=> res?.json()); 
                          if(Array.isArray(cacheDataJSON.value)){
                            cacheDataJSON.value = cacheDataJSON.value.map((e: any)=> e.id === id ? {...e, ...data} : e)
                          }else{
                            cacheDataJSON.value = {...cacheDataJSON.value, ...data}
                          }
                          set(cache.url, cacheDataJSON.value, new Date().getTime() + 3600);
                           
                      }
                  }
                }
                
            }
            let cb = this.callback((data)=>{ 
               if(data.opCode !== HttpCodes.OK) return reject(data)
                resolve(data)
            })
            this.sendMsg({
                type: GeneralTypes.UPDATE,
                payload: {
                    collection: name,
                    id: id,
                    fields: data,
                    options
                },
                security : {
                    token: this.authStore.model.token
                },
                callback: cb
            })
        })
       },
      /**
       * @method create
       * @description create a record in a collection
       * @param data
       * @returns {Promise<any>}
       */
      create: async (data: any) => {
        return new Promise((resolve, reject) => {
          let cb = this.callback((data) => { 
            if(data.opCode !== HttpCodes.OK) return reject(data) 
            resolve(data.payload)
          });
          this.sendMsg({
            type: GeneralTypes.CREATE,
            payload: {
              collection: name,
              data,
            },
            security: {
              token: this.authStore.model.token,
            },
            callback: cb,
          });
        });
      },

      /**
       * @method get
       * @description get a record in a collection
       * @param id
       * @returns {Promise<any>}
       */

      get: async (id: string, options?:{expand?: string[]}) => {
        return new Promise(async (resolve, reject)=>{
          let cacheKey = `${this.serverURL}/api/collections/${name}/${id}`;
          let cacheData = await useCache().get(cacheKey); 
          if(cacheData) return resolve(cacheData.payload);
          let cb = this.callback((data)=>{ 
              if(data.opCode !== HttpCodes.OK) return reject(data)
              useCache().set(cacheKey, data, new Date().getTime() + 3600);
              resolve(data.payload)
          }) 
          this.sendMsg({
            type: GeneralTypes.GET,
            payload: {
              collection: name,
              id,
              options
            },
            security: {
              token: this.authStore.model.token
            },
            callback: cb
          })
        })
      },
    };
  }
}
