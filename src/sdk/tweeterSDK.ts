/**
 * @file tweeterSDK.ts
 * @description tweeterSDK
 * @version v0.0.2
 * 
 */

import { isTokenExpired } from "./jwt/index"

interface event {
    connected: any
    disconnected: any
}

interface model {
    id: string
    avatar: string,
    username: string,
    created: string,
    bio: string,
    updated: string,
    bookmarks: Array<string>,
    followers: Array<string>,
    token: string
}

interface authStore {
    model: any
    onChange: Function
    update: Function
    clear: Function
    isValid: boolean,
    img: Function,
    isRatelimited: Function
}

/**
 * @class tweeterSDK
 * @description tweeterSDK - the official tweeter hapta client sdk
 * @version v0.0.2
 */

export default class tweeterSDK {
    private type: string
    private ws: WebSocket
    private sendMessage: (e: any) => void
    private callbacks: Map<string, any>
    private isStandalone: boolean
    declare localStorage: any
    token: string
    changeEvent: CustomEvent
    cancellation: any
    pbUrl: string
    currType: string
    constructor(wsUrl: string, pbUrl: string, cancellation?: boolean) {
        this.token = JSON.parse(localStorage.getItem("tweeter_auth") || "{}").token
        this.isStandalone = false
        typeof window == "undefined" ? this.type = "server" : this.type = "client"
        this.ws = new WebSocket(wsUrl)
        /**
         * @param {boolean} cancellation
         * @description cancel request if taking too long
         */
        this.cancellation  = cancellation
        this.sendMessage = (e) => {
            this.waitForSocketConnection(() => {
                this.ws.send(e)
            })
        }
        this.currType = ""
        this.pbUrl = pbUrl

        this.callbacks = new Map()
        this.ws.onmessage = (e) => this.onmessage(e);

        if (typeof window == "undefined") {
            throw new Error("Cannot use client side sdk on server side - use TweeterCJS instead")
        }
        this.changeEvent = new CustomEvent("authChange", { detail: { model: JSON.parse(localStorage.getItem("tweeter_auth") || "{}").model, token: JSON.parse(localStorage.getItem("tweeter_auth") || "{}").token } })
    }
    /**
     * @method upload
     * @description convert file into readable format
     * @param file 
     * @returns 
     */
    public getRawFileData(file: File): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            // Create a FileReader to read the file
            let reader = new FileReader();

            // Set up event listeners for when the file reading is complete
            reader.onload = () => {
                // Resolve the Promise with the result (Uint8Array)
                const arrayBuffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);
                resolve(uint8Array);
            };

            // Set up an event listener for errors during file reading
            reader.onerror = (error) => {
                // Reject the Promise with the error
                reject(error);
            };

            // Read the file as an ArrayBuffer
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * @method authStore
     * @description Get the current authmodel data and listen for changes
     * @returns {authStore}
     * 
     */
    public authStore: authStore = {
        model: JSON.parse(localStorage.getItem("tweeter_auth") || "{}").model,
        onChange: (callback: Function) => {
            window.addEventListener("authChange", (e: Event) => {
                const authChange = (e as CustomEvent).detail
                callback(authChange)
            })

        },
        update: () => {
            if (typeof window == "undefined") return;
            this.callbacks.set('authUpdate', (data: any) => {

                if (data.error) throw new Error(data.error);
                else if (data.clientData) localStorage.setItem("tweeter_auth", JSON.stringify({ model: data.clientData, token: this.token }))
                this.authStore.model = data.clientData
                window.dispatchEvent(this.changeEvent)
                this.callbacks.delete('authUpdate');



            })
            this.sendMessage(JSON.stringify({ type: "authUpdate", data: { record: this.authStore.model, token: this.token, key: 'authUpdate' } }))

        },
        img: () => {
            return `${this.pbUrl}/api/files/_pb_users_auth_/${this.authStore.model.id}/${this.authStore.model.avatar}`
        },
        clear: () => {
            if (typeof window == "undefined") return;
            localStorage.removeItem("tweeter_auth")
            this.authStore.model = null
            window.dispatchEvent(this.changeEvent)
        },
        /**
         * @param {boolean} isValid
         * @description check if token is expired
         */
        isValid: isTokenExpired(JSON.parse((localStorage.getItem("tweeter_auth") || '{}')) ? JSON.parse((localStorage.getItem("tweeter_auth") || '{}')).token : null,
            0) 

    }

    public isRatelimited: Function = (type: string) => {
        return new Promise((resolve, reject) => {
        this.callbacks.set('isRatelimited', (data: any) => {
            if (data.error) reject(data.error);
            resolve(data)
            this.callbacks.delete('isRatelimited');
        })
        this.sendMessage(JSON.stringify({ type: "isRatelimited",  key: 'isRatelimited', token:this.token, method: type}))
    })
    } 
    /**
     * @method authWithPassword
     * @param emailOrUsername 
     * @param password 
     * @returns  {Promise<model>}
     * @description Authenticate user with email or username and password
     */


    public authWithPassword(emailOrUsername: string, password: string) {
        return new Promise((resolve, reject) => {
            if (typeof window == "undefined") {
                throw new Error("Cannot use client side function on server side")
            }
            if (!emailOrUsername) {
                throw new Error("email or username is required")
            }
            else if (!password) {
                throw new Error("password is required")
            }
            else {
                this.callbacks.set("auth&password", (data: any) => {
                    if (data.clientData) {
                        localStorage.setItem("tweeter_auth", JSON.stringify({ model: data.clientData.record, token: data.clientData.token }))
                        resolve(data.clientData)
                        this.callbacks.delete("auth&password")
                        window.dispatchEvent(this.changeEvent)
                    } else if (data.error) {
                        reject(new Error(data.error))
                        this.callbacks.delete("auth&password")
                    }
                })
                emailOrUsername.includes("@") ? this.sendMessage(JSON.stringify({ key: "auth&password", type: "auth&password", data: { email: emailOrUsername, password: password } })) :
                    this.sendMessage(JSON.stringify({ type: "auth&password", data: { username: emailOrUsername, password: password } }))
            }
        })
    }
    private waitForSocketConnection(callback: Function) {
        const maxWaitTime = 5000; // Maximum waiting time in milliseconds (adjust as needed)
        const interval = 100; // Check the WebSocket state every 100 milliseconds

        const checkConnection = () => {


            if (this.ws.readyState === WebSocket.OPEN) {
                if (callback != null) {
                    callback();

                }
            } else if (this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING) {
                // Handle connection closure or failure
                console.error("WebSocket connection closed or failed.");
                if (callback != null) {
                    callback(new Error("WebSocket connection closed or failed."));

                }
            } else {
                // The connection is not yet open, so check again in 100 milliseconds
                setTimeout(checkConnection, interval);

            }


        };

        // Start checking the connection
        checkConnection();

        // Set a maximum waiting time
        setTimeout(() => {
            if (this.ws.readyState !== WebSocket.OPEN && callback != null) {
                callback(new Error("WebSocket connection timed out."));
            }
        }, maxWaitTime);
    }
    /**
     * @method getAsByteArray   
     * @param file 
     * @returns {Promise<Uint8Array>}
     * @description convert file into readable format to be uploaded through the websockete connection
     */

    public getAsByteArray(file: File): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);
                resolve(uint8Array);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    }


    /**
     * @method oauth
     * @param data
     * @description Authenticate user with oauth provider 
     * @returns  {Promise<model>}
     */

    public oauth(data: { provider: string, redirect_uri: string }) {
        return new Promise((resolve, reject) => {
            if (typeof window == "undefined") {
                throw new Error("Cannot use client side function on server side")
            }
            if (!data.provider) {
                throw new Error("provider is required")
            }
            else if (!data.redirect_uri) {
                throw new Error("redirect_uri is required")
            }
            else {
                let redirect_uri = data.redirect_uri
                this.callbacks.set("oauth", (data: any) => {
                    data.url ? window.open(data.url) : null
                    if (data.clientData) {
                        localStorage.setItem("tweeter_auth", JSON.stringify({ model: data.clientData.record, token: data.clientData.token }))
                        window.location.href = redirect_uri
                        resolve(data.clientData)
                        this.callbacks.delete("oauth")
                        window.dispatchEvent(this.changeEvent)

                    } else if (data.error) {
                        reject(new Error(data.error))
                        this.callbacks.delete("oauth")
                    }
                })
                this.sendMessage(JSON.stringify({ type: "oauth", data: data }))
            }
        })

    }
    private onmessage(e: any) {
        let data = JSON.parse(e.data)
        if (this.callbacks.has(data.key)) {
            let func = this.callbacks.get(data.key)

            func(data.data ? data.data : data)
        }
    }

    /**
     * @method read
     * @param data 
     * @returns  {Promise<any>}
     * @description Read a record from a collection
     */

    public read(data: { id: string, collection: string, returnable?: Array<string>, expand: Array<string> }) {
        return new Promise((resolve, reject) => {
            let key = crypto.randomUUID();
            !data.collection ? (reject(new Error("collection is required"))) : null;
            !this.authStore.isValid ? (reject(new Error("token is expired"))) : null;
    
            this.callbacks.set(key, (responseData: any) => {
                if (responseData.error) {
                    reject(responseData);
                } else {
                    resolve(responseData);
                }
                this.callbacks.delete(key);
            });
    
            this.sendMessage(JSON.stringify({
                type: "read", key: key, collection: data.collection, token: this.token, id: data.id, returnable: data.returnable, expand: data.expand
            }));
     
        });
    }
    
    /**
     * @method update
     * @param data 
     * @returns  {Promise<any>}
     * @description Update a record in a collection
     */
    public update(data: { id: string, collection: string, filter?: string, record: Object, sort?: string }) {
        
        return new Promise((resolve, reject) => {
            let key = crypto.randomUUID()
            !data.collection ? (reject(new Error("collection is required"))) : null
            !data.record ? (reject(new Error("data is required"))) : null
            !this.authStore.isValid ? (reject(new Error("token is expired"))) : null


            this.callbacks.set(key, (data: any) => {
                if (data.error) reject(data);
                resolve(data)
                this.callbacks.delete(key)
            })



            this.sendMessage(JSON.stringify({ type: "update", key: key, data: data.record, collection: data.collection, sort: data.sort, filter: data.filter, token: this.token, id: data.id }))
        })
    }
    /**
     * @method list
     * @param data
     * @returns  {Promise<any>}
     * @description List records from a collection
     */
    public list(data: { collection: string, filter?: string, sort?: string, limit?: number, page?: number, returnable?: Array<string>, expand: Array<string> }) {
        return new Promise((resolve, reject) => {
            let key = crypto.randomUUID();
            this.currType = "list"
            !data.collection ? (reject(new Error("collection is required"))) : null;
            !this.authStore.isValid ? (reject(new Error("token is expired"))) : null;
    
            this.callbacks.set(key, (responseData: any) => {
                if (responseData.error)  return;
                else resolve(responseData);
                this.callbacks.delete(key);
            });
    
            this.sendMessage(JSON.stringify({
                   type: "list", 
                    key: key, token: 
                    this.token, 
                    data: {
                    returnable: data.returnable || null,
                    collection: data.collection,
                    sort: data.sort,
                    filter: data.filter,
                    limit: data.limit,
                    offset: data.page,
                    id: this.authStore.model?.id || null,
                    expand: data.expand || null
                }
            }));
    
            
            
        });
    }
    
    /**
     * @method delete
     * @param data 
     * @returns  {Promise<any>}
     * @description Delete a record from a collection
     */
    public delete(data: { id: string, collection: string, filter: string }) {
        return new Promise((resolve, reject) => {
            let key = crypto.randomUUID()
            !data.collection ? (reject(new Error("collection is required"))) : null
            !this.authStore.isValid ? (reject(new Error("token is expired"))) : null
            this.callbacks.set(key, (data: any) => {
                if (data.error) reject(data);
                resolve(data)
            })

            this.sendMessage(JSON.stringify({ type: "delete", key: key, collection: data.collection, filter: data.filter, token: this.token, id: this.authStore.model?.id || null }))
        })
    }
    /**
     * @method create
     * @param data 
     * @returns  {Promise<any>}
     * @description Create a record in a collection
     */
    public create(data: { collection: string, record: object }) {
        console.log(data.collection !== "users")
        return new Promise((resolve, reject) => {
            let key = crypto.randomUUID()
            !data.collection ? (reject(new Error("collection is required"))) : null
            !data.record ? (reject(new Error("record is required"))) : null
            if (data.collection !== "users" && !this.authStore.isValid) {
                reject(new Error("token is expired"))
            }
            this.callbacks.set(key, (data: any) => {
                if (data.error) reject(data.message);
                resolve(data)
            })

            this.sendMessage(JSON.stringify({ method: "create", type: "create", key: key, data: data.record, collection: data.collection, token: this.token || null, id: this.authStore.model?.id || null }))
        })
    }

    public on(event: string, callback: Function) {
        if (!event) {
            throw new Error("event is required")
        }
        else if (!callback) {
            throw new Error("callback is required")
        }
        else if (typeof callback !== "function") {
            throw new Error("callback must be a function")
        }
        else if (!this.callbacks.has(event)) {
            this.callbacks.set(event, callback)
        }
        else {
            throw new Error("event already exists")
        }
    }
}
