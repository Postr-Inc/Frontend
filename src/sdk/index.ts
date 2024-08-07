"use client";
import { MessageTypes } from "./enums/MessageTypes";
import { isTokenExpired } from "./jwt/index";
import { authStore, isRatelimited, model } from "./types/AuthStore";
import { subscribeOptions } from "./types/Subscribe";
const store = {
  get: (key: string) => {
    if (typeof window == "undefined") return;
    return localStorage.getItem(key);
  },

  set: (key: string, value: any) => {
    if (typeof window == "undefined") return;
    return localStorage.setItem(key, value);
  },
  remove: (key: string) => {
    if (typeof window == "undefined") return;
    return localStorage.removeItem(key);
  },
  clear: () => {
    if (typeof window == "undefined") return;
    return localStorage.clear();
  },
};

/**
 * @class PostrSDK
 * @description PostrSDK - the official Postr hapta client sdk
 * @version v0.0.4
 */

export default class postrSdk {
  private ws: WebSocket;
  private sendMessage: (e: any) => Promise<unknown>;
  private callbacks: Map<string, any>;
  private isStandalone: boolean;
  onlineEvent: CustomEvent;
  changeEvent: CustomEvent;
  cancellation: any;
  online: Map<string, any>;
  sessionID: string;
  pbUrl: string;
  subscriptions: Map<string, boolean>;
  currType: string;
  private $memoryCache: Map<string, any>;
  token: string;
  constructor(data: { wsUrl: string; pbUrl: string; cancellation: any }) {
    this.onlineEvent = new CustomEvent("online");
    this.changeEvent = new CustomEvent("change");
    this.sessionID = crypto.randomUUID();
    this.isStandalone = false;
    this.subscriptions = new Map();
    this.ws = new WebSocket(
      `${
        data.wsUrl.trim().startsWith("127") ||
        data.wsUrl.trim().startsWith("localhost")
          ? "ws"
          : "wss"
      }://${data.wsUrl}`
    );
    this.$memoryCache = new Map();
    //@ts-ignore
    typeof window !== "undefined"
      ? //@ts-ignore
        (window.postr = {
          version: " 1.7.0",
        })
      : null;
    this.token = JSON.parse(store.get("postr_auth") || "{}")
      ? JSON.parse(store.get("postr_auth") || "{}").token
      : null;
    /**
     * @param {boolean} cancellation
     * @description cancel request if taking too long
     */
    this.cancellation = data.cancellation;
    this.sendMessage = (e) => {
      return new Promise((resolve, reject) => {
        this.waitForSocketConnection(() => {
          this.ws.send(e);
          resolve(0);
        });
      });
    };
    this.currType = "";
    this.pbUrl = data.pbUrl;
    this.callbacks = new Map();
    this.ws.onmessage = (e) => this.onmessage(e);
    const onConnect = () => {
      console.log("Connected to server");
      this.ws.send(
        JSON.stringify({
          type: "authSession",
          token: this.token,
          session: this.sessionID,
        })
      );
    };
    this.ws.onopen = () => {
      onConnect();
    };

    let isAwaiting = false;
    let reconnectTimeout = null;

    const connectWebSocket = () => {
      this.ws = new WebSocket(
        `${
          data.wsUrl.trim().startsWith("127") ||
          data.wsUrl.trim().startsWith("localhost")
            ? "ws"
            : "wss"
        }://${data.wsUrl}`
      );

      this.ws.onmessage = (e) => this.onmessage(e);
      this.ws.onopen = () => {
        onConnect();
        this.authStore.refreshToken();
        isAwaiting = false; // Reset the flag on successful connection
      };


      


      this.ws.onclose = () => {
        console.log("Connection closed unexpectedly");
        isAwaiting = false; // Reset the flag on unexpected close
        scheduleReconnect(); // Schedule another reconnect attempt
      };

      console.log("Reconnecting to server");
    };

    const isLoggedIn = (callback: any) =>{
      if (this.authStore.isValid()) {
        callback();
      } else { 
        setTimeout(() => {
          isLoggedIn(callback);
        }, 1000 );
      }
    }


    isLoggedIn(() => {
      const broadcast = new BroadcastChannel('notify');
      
      navigator.serviceWorker.register('/serviceworker/worker.js')
          .then((registration) => { 
            registration.update();
              console.log('Service worker registered:', registration); 
              const token = this.authStore.model().token; // Ensure token is fetched correctly
              broadcast.postMessage(JSON.stringify({ type: 'init', token: token }));
          })
          .catch((error) => {
              console.error('Service worker registration failed:', error);
          });
      
      navigator.serviceWorker.ready
          .then((registration) => {
              console.log('Service worker ready:', registration);
          })
          .catch((error) => {
              console.error('Service worker readiness failed:', error);
          });

          // if already registered, update the token
        broadcast.postMessage(JSON.stringify({ type: 'init', token: this.authStore.model().token }));
  });
  


    // request notification permission
    if (typeof window !== "undefined") {
      Notification.requestPermission().then((permission) => {
        console.log(permission);
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      });
    }
    function scheduleReconnect() {
      if (!isAwaiting) {
        isAwaiting = true;
        reconnectTimeout = setTimeout(() => {
          connectWebSocket();
        }, 1000); // Reconnect attempt after 1 second
      }
    }

    this.ws.onclose = () => {
      scheduleReconnect();
    };

    this.online = new Map();
    if (typeof window !== "undefined") {
      this.changeEvent = new CustomEvent("authChange", {
        detail: {
          model: JSON.parse(store.get("postr_auth") || "{}").model,
          token: JSON.parse(store.get("postr_auth") || "{}")
            ? JSON.parse(store.get("postr_auth") || "{}").token
            : null,
        },
      });
      this.onlineEvent = new CustomEvent("online", {
        detail: { online: this.online },
      });

      //@ts-ignore
      window.onbeforeunload = () => {
        // kill the session but also the token
        this.sendMessage(
          JSON.stringify({
            type: "close",
            token: this.token,
            session: this.sessionID,
          })
        ).then(() => {
          this.ws.close();
        });

        this.subscriptions.forEach((value, key) => {
          this.sendMessage(
            JSON.stringify({
              type: "unsubscribe",
              key: key,
              token: this.authStore.model().token,
              session: this.sessionID,
            })
          );
        });
      };
    }

    let timer = setInterval(() => {
      this.$memoryCache.forEach((value, key) => {
        // clear cache if expired
        let cache = JSON.parse(value);

        if (cache.time) {
          if (new Date().getTime() - cache.time > cache.cacheTime) {
            this.$memoryCache.delete(key);
            clearInterval(timer);
          }
        }
      });
    }, 1000);

    let cehckOnline = setInterval(() => {
      if (this.ws.readyState !== WebSocket.OPEN) {
      } else {
        clearInterval(cehckOnline);
      }
    }, 1000);
  }
  queue = new Map();

  checkConnection() {
    if (this.ws.readyState === WebSocket.OPEN) {
      return true;
    } else return false;
  }

  /**
   * @method events
   * @description Listen for events
   * @returns {events}
   * @example
   * ```typescript
   * api.events.on("event", (data) => {
   * console.log(data)
   * })
   * api.events.emit("event", {data: "data"})
   * ```
   */
  public events = {
    emit: (event: string, data: any) => {
      if (typeof window == "undefined") return;
      window.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    on: (event: string, callback: Function) => {
      if (typeof window == "undefined") return;
      window.addEventListener(event, (e: any) => {
        callback(e);
      });
    },
  };

  isSubscribed = (key: string) => {
    return this.subscriptions.has(key);
  };
  /**
   * @method  getRawFileData
   * @description Convert File into Uint8Array format to be uploaded through the websocket connection
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
   * @method  checkName
   * @param emailOrUsername 
   * @description Check if a username or email exists
   * @returns  {Promise<boolean>}
   */
  public checkName(emailOrUsername: string) {
    return new Promise((resolve, reject) => { 
      if (!emailOrUsername) {
        reject(new Error("email or username is required"));
      }
      this.callbacks.set("checkname", (data: any) => {
        if (data.error) {
          reject(new Error(data));
        } else {
          resolve(data.exists);
        } 
      });
      console.log({...(emailOrUsername.includes("@") ? {email: emailOrUsername} : {username: emailOrUsername})})
      this.sendMessage(
        JSON.stringify({
          type: "checkname",
          key:   "checkname",
          data: {
            ...(emailOrUsername.includes("@") ? {email: emailOrUsername} : {username: emailOrUsername})
          },
          session: this.sessionID,
        })
      );
    });
  }

  /**
   *
   * @method changePassword
   * @description Change the users password
   */
  public changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmedPassword: string;
  }) {
    let { currentPassword, newPassword, confirmedPassword } = data;
  }

  /**
   * @method cdn
   * @description Get files from the postr cdn
   * @returns {cdn}
   *
   */
  cdn = {
    url: (data: { id: string; collection: string; file: string }) => {
      return `${this.pbUrl}/api/files/${data.collection}/${data.id}/${data.file}`;
    },

    getFile: (data: {
      recordId: string;
      collection: string;
      field: string;
    }) => {
      return new Promise((resolve, reject) => {
        let key = crypto.randomUUID();
        !data.collection ? reject(new Error("collection is required")) : null;
        !data.recordId ? reject(new Error("recordId is required")) : null;
        !data.field ? reject(new Error("field is required")) : null;
        this.callbacks.set(key, (d: any) => {
          if (d.error) reject(d.error);
          let file = new Blob([new Uint8Array(d.file)], { type: d.type });
          let fileObj = new File([file], d.fileName, { type: d.fileType });

          let reader = new FileReader();
          reader.onload = () => {
            // convert to base64 string
            resolve(reader.result);
          };
          reader.readAsDataURL(fileObj);
        });

        this.sendMessage(
          JSON.stringify({
            type: "fetchFile",
            key: key,
            collection: data.collection,
            field: data.field,
            recordID: data.recordId,
            token: this.authStore.model().token,
            session: this.sessionID,
          })
        );
      });
    },
  };

  /**
   * @method cacheStore
   * @description Cache values with exp duration in ms
   * @returns {cacheStore}
   */
  cacheStore = {
    /**
     * @method set
     * @description Set a value in the cache
     * @param key
     * @param value
     * @param cacheTime
     * @returns
     */
    set: (key: string, value: any, cacheTime: number) => {
      if (typeof window == "undefined") return;
      if (cacheTime) {
        let cache = {
          value: value,
          cacheTime: cacheTime,
          time: new Date().getTime(),
        };
        this.$memoryCache.set(key, JSON.stringify(cache));
      } else {
        this.$memoryCache.set(key, value);
      }
    },
    update: (key: string, value: any) => {
      if (typeof window == "undefined") return;
      let cache = this.$memoryCache.get(key);
      if (cache) {
        if (cache.cacheTime) {
          cache.value = value;
          cache.time = new Date().getTime();
          this.$memoryCache.set(key, JSON.stringify(cache));
        } else {
          this.$memoryCache.set(key, value);
        }
      }
    },
    get: (key: string) => {
      if (typeof window == "undefined") return;
      let cache = this.$memoryCache.get(key);
      if (cache) {
        if (cache.cacheTime) {
          if (new Date().getTime() - cache.time > cache.cacheTime) {
            this.$memoryCache.delete(key);
            return null;
          } else {
            return cache.value;
          }
        } else {
          return cache;
        }
      } else {
        return null;
      }
    },
    delete: (key: string) => {
      if (typeof window == "undefined") return;
      this.$memoryCache.delete(key);
    },
    has: (key: string) => {
      if (typeof window == "undefined") return;
      return this.$memoryCache.has(key);
    },
    all: () => {
      return this.$memoryCache.entries();
    },
    keys: () => {
      return Array.from(this.$memoryCache.keys());
    },
  };

  private appendToQueue(data: any) {
    if (!data.requestID && !this.queue.has(data.requestID)) return;
  }

  /**
   * @method authStore
   * @description Get the current authmodel data and listen for changes
   * @returns {authStore}
   *
   */
  public authStore: authStore = {
    /**
     * @description Refresh the current token
     * @method refreshToken
     * @returns {Auth_Object}
     */
    refreshToken: async () => {
      if (typeof window == "undefined") return;
      let t = this;
      console.log("Refreshing token");
      this.callbacks.set("tokenRefresh", (data: any) => {
        console.log(data);
        return new Promise((resolve, reject) => {
          if (data.error && data.hasOwnProperty("isValid") && !data.isValid && localStorage.getItem("postr_auth")) {
            localStorage.removeItem("postr_auth")
            window.dispatchEvent(this.changeEvent);
            reject(data);
            return;
          }
          localStorage.setItem(
            "postr_auth",
            JSON.stringify({
              model: this.authStore.model(),
              token: data.token || this.authStore.model().token,
            })
          );
          window.dispatchEvent(this.changeEvent);
        });
      });
      this.sendMessage(
        JSON.stringify({
          type: "refreshToken",
          key: MessageTypes.REFRESH_TOKEN,
          token: this.authStore.model().token,
          session: this.sessionID,
        })
      );
    },

  checkToken: async () => {
    return new Promise((resolve, reject) => {
      this.callbacks.set("checkToken", (data: any) => {
        if (data.error) reject(data);
        resolve(data);
        this.callbacks.delete("checkToken");
      });
      this.sendMessage(
        JSON.stringify({
          type: MessageTypes.CHECK_TOKEN,
          key:  MessageTypes.CHECK_TOKEN,
          token: this.authStore.model().token,
          session: this.sessionID,
        })
      );
    });
  },

    resetPassword: async (token: string, password: string) => {
      return new Promise((resolve, reject) => {
        if (!password || !token)
          return reject(new Error("email, password and token are required"));
        this.callbacks.set("resetPassword", (data: any) => {
          if (data.error) reject(data);
          resolve(data);
          this.callbacks.delete("resetPassword");
        });
        console.log({ password, token });
        this.sendMessage(
          JSON.stringify({
            type: "changePassword",
            key: MessageTypes.RESET_PASSWORD,
            data: {
              password: password,
              token: token,
            },
            session: this.sessionID,
          })
        );
      });
    },
    requestPasswordReset: async (email: string) => {
      return new Promise((resolve, reject) => {
        if (!email) return reject(new Error("email is required"));
        this.callbacks.set("requestPasswordReset", (data: any) => {
          if (data.error) reject(data);
          resolve(data);
          this.callbacks.delete("requestPasswordReset");
        });
        this.sendMessage(
          JSON.stringify({
            type: MessageTypes.REQUEST_PASSWORD_RESET,
            key: MessageTypes.REQUEST_PASSWORD_RESET,
            data: { email },
            session: this.sessionID,
          })
        );
      });
    },

    login: async (emailOrUsername: string, password: string) => {
      return new Promise((resolve, reject) => {
        this.callbacks.set("auth&password", (data: any) => {
          if (data.clientData) {
            if (typeof window == "undefined") return;
            if (typeof window !== undefined)
              localStorage.setItem(
                "postr_auth",
                JSON.stringify({
                  model: data.clientData.record,
                  token: data.clientData.token,
                })
              );
            resolve(data.clientData.record);
            this.callbacks.delete("auth&password");
            window.dispatchEvent(this.changeEvent);
          } else if (data.error) {
            reject(new Error(data));
            this.callbacks.delete("auth&password");
          }
        });
        this.sendMessage(JSON.stringify({
          type: "auth&password",
          data: { emailOrUsername, password },
          key: "auth&password",
          session: this.sessionID
        }));
      });
    },
    create: async (data: any) => {
      return new Promise((resolve, reject) => {
        if (!data.username || !data.email || !data.password) return reject(new Error("username, email and password are required"));
        this.callbacks.set("authCreate", (data: any) => {
          console.log(data);
          if (data.error) return reject(data);
          return resolve(data);
        });
        this.sendMessage(
          JSON.stringify({
            type: "authCreate",
            key: "authCreate",
            data: data,
            session: this.sessionID,
          })
        );
      });
    },
    update: () => {
      if (typeof window == "undefined" || !localStorage.getItem("postr_auth"))
        return;
      this.callbacks.set("authUpdate", (data: any) => {
        if (data.error && data.hasOwnProperty("isValid") && !data.isValid) {
          console.error(data);
        } else if (data.error) {
          throw new Error(data);
        } else if (data.clientData) {
          console.log("Auth updated" + data.clientData);
        }
      });
      this.sendMessage(
        JSON.stringify({
          type: MessageTypes.AUTH_UPDATE,
          token: this.authStore.model().token,
          key: "authUpdate",
          data: JSON.parse(localStorage.getItem("postr_auth") as any).model,
          session: this.sessionID,
        })
      );
    },
    /**
     * @method model
     * @description Get the current authmodel data
     * @returns {Auth_Object}
     */
    model: (data?: any) => {
      if (data) {
        if (typeof window == "undefined") return;
        localStorage.setItem(
          "postr_auth",
          JSON.stringify({
            model: data,
            token: JSON.parse(store.get("postr_auth") || "{}").token,
          })
        );
      } else {
        if (typeof window == "undefined") return;
        return {
          ...JSON.parse(store.get("postr_auth") || "{}").model,
          token: JSON.parse(store.get("postr_auth") || "{}").token,
        };
      }
    },
    onChange: (callback: Function) => {
      if (typeof window == "undefined") return;
      window.addEventListener("authChange", (e: Event) => {
        const authChange = (e as CustomEvent).detail;
        callback(authChange);
      });
    },
    /**
     * @method isValid
     * @description Check if the current token is valid
     * @returns
     */
    isValid: () => { 
      let tokeneists = JSON.parse(store.get("postr_auth") || "{}").token;
      if (!tokeneists) return false;
      return !isTokenExpired(tokeneists);
    },
    img: () => {
      if (typeof window == "undefined") return;
      return this.cdn.url({
        id: this.authStore.model().id,
        collection: "users",
        file: this.authStore.model().avatar,
      });
    },
    /**
     * @method isRatelimited
     * @description Check if the current token is ratelimited
     * @param type
     * @returns
     */
    isRatelimited: async (type: string): Promise<isRatelimited> => {
      return new Promise((resolve, reject) => {
        this.callbacks.set("isRatelimited", (data: any) => {
          if (data.error) reject(data);
          resolve(data);
          this.callbacks.delete("isRatelimited");
        });
        this.sendMessage(
          JSON.stringify({
            type: "isRatelimited",
            key: "isRatelimited",
            token: this.authStore.model().token,
            method: type,
            session: this.sessionID,
          })
        );
      });
    },
    /**
     * @method clear
     * @description Invalidate the current session
     */
    clear: () => {
      try {
        if (typeof window == "undefined") return;
        store.remove("postr_auth");
        window.dispatchEvent(this.changeEvent);
      } catch (error) {
        console.error(error);
      }
    },
    global: undefined
  };

  /**
   * @method notify
   * @description pushes notifications to the user
   */
  public notify = {
    /** 
     * @param data
     * @method send
     * @description Send a notification to a user 
     * @returns 
     */
    send: (data: { title: string; body: string; icon: string; recipient: string }) => {
      return new Promise((resolve, reject) => { 
        this.callbacks.set("notify", (data: any) => {
          if (data.error) reject(data);
          resolve(data);
        });
        this.sendMessage(
          JSON.stringify({
            type: "notify",
            key: "notify",
            data: data, 
            session: this.sessionID,
            token: this.authStore.model().token,
          })
        );
      });
    
    }
  }
   
  private waitForSocketConnection(callback: Function) {
    const maxWaitTime = 5000; // Maximum waiting time in milliseconds (adjust as needed)
    const interval = 100; // Check the WebSocket state every 100 milliseconds

    const checkConnection = () => {
      if (this.ws.readyState === WebSocket.OPEN) {
        if (callback != null) {
          callback();
        }
      } else if (
        this.ws.readyState === WebSocket.CLOSED ||
        this.ws.readyState === WebSocket.CLOSING
      ) {
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
        console.log(file)
        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const uint8Array = new Uint8Array(arrayBuffer);
            //@ts-ignore
            resolve(Array.from(uint8Array));
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

  public oauth(data: {
    provider: string;
    redirect_uri: string;
    redirect?: boolean;
  }) {
    return new Promise((resolve, reject) => {
      if (!data.provider) {
        throw new Error("provider is required");
      } else if (!data.redirect_uri) {
        throw new Error("redirect_uri is required");
      } else {
        let { provider, redirect_uri, redirect } = data;
        this.callbacks.set("oauth", (data: any) => {
          if (typeof window == "undefined") return;
          data.url ? window.open(data.url) : null;
          if (data.clientData) {
            localStorage.setItem(
              "postr_auth",
              JSON.stringify({
                model: data.clientData.record,
                token: data.clientData.token,
              })
            );
            resolve(data.clientData);
            window.dispatchEvent(this.changeEvent);
          } else if (data.error) {
            reject(new Error(data));
          }
        });
        this.sendMessage(
          JSON.stringify({ type: "oauth", data: data, session: this.sessionID })
        );
      }
    });
  }

  private onmessage(e: any) {
    let data = JSON.parse(e.data); 
    if (this.callbacks.has(data.key)) {
      let func = this.callbacks.get(data.key);
      func(data.data ? data.data : data);
    } else if (data.type === "status") {
      data.data.forEach((d: any) => {
        this.online.set("online", d);
        if (typeof window !== "undefined") {
          let timer = setTimeout(() => {
            window.dispatchEvent(this.onlineEvent);
            clearTimeout(timer);
          }, 1000);
        }
      });
    } else if (data.type == "pong") {
      let latency = Date.now() - data.time;
      this.online.set("latency", latency);
      if (typeof window !== "undefined") {
        let timer = setTimeout(() => {
          window.dispatchEvent(this.onlineEvent);
          clearTimeout(timer);
        }, 1000);
      }
    }
  }

  /**
   * @method read
   * @param data
   * @returns  {Promise<any>}
   * @description Read a record from a collection
   */

  public async read(data: {
    id: string;
    collection: string;
    returnable?: Array<string>;
    cacheKey?: string;
    expand?: Array<string>;
    authKey?: string;
  }) {
    return new Promise((resolve, reject) => {
      !data.collection ? reject(new Error("collection is required")) : null;
      !this.authStore.isValid() ? reject(new Error("token is expired")) : null;

      this.sendMessage(
        JSON.stringify({
          type: "read",
          key: this.callback(resolve, reject),
          collection: data.collection,
          token: JSON.parse(store.get("postr_auth") || "{}").token,
          cacheKey: data.cacheKey || null,
          id: data.id,
          returnable: data.returnable,
          expand: data.expand,
          session: this.sessionID,
          authKey: data.authKey || null,
        })
      );
    });
  }

  /**
   * @method update
   * @param data
   * @returns  {Promise<any>}
   * @description Update a record in a collection
   */
  public update(data: {
    id: string;
    collection: string;
    filter?: string;
    record: Object;
    sort?: string;
    skipDataUpdate?: boolean;
    invalidateCache?: Array<string>;
    immediatelyUpdate?: boolean;
    expand?: Array<string>;
    cacheKey?: string;
  }) {
    return new Promise((resolve, reject) => {
      let key = crypto.randomUUID();
      !data.collection ? reject(new Error("collection is required")) : null;
      !data.record ? reject(new Error("data is required")) : null;
      !this.authStore.isValid ? reject(new Error("token is expired")) : null;

      this.sendMessage(
        JSON.stringify({
          type: "update",
          key: this.callback(resolve, reject),
          data: data.record,
          expand: data.expand,
          collection: data.collection,
          skipDataUpdate: data.skipDataUpdate || false,
          invalidateCache: data.invalidateCache || null,
          immediatelyUpdate: data.immediatelyUpdate || false,
          sort: data.sort,
          filter: data.filter,
          token: JSON.parse(store.get("postr_auth") || "{}").token,
          id: data.id,
          session: this.sessionID,
          cacheKey: data.cacheKey || null,
        })
      );
    });
  }
  /**
   * @method list
   * @param data
   * @returns  {Promise<any>}
   * @description List records from a collection
   */
  public list(data: {
    collection: string;
    filter?: string;
    sort?: string;
    limit?: number;
    page?: number;
    returnable?: Array<string>;
    expand?: Array<string>;
    refresh?: boolean;
    refreshEvery?: number;
    cacheKey?: string;
    cacheTime?: number;
  }) {
    return new Promise((resolve, reject) => {
      this.currType = "list";
      !data.collection ? reject(new Error("collection is required")) : null;
      !this.authStore.isValid ? reject(new Error("token is expired")) : null;
      this.sendMessage(
        JSON.stringify({
          type: "list",
          key: this.callback(resolve, reject),
          token: this.authStore.model().token,
          data: {
            returnable: data.returnable || null,
            collection: data.collection,
            sort: data.sort,
            filter: data.filter,
            cacheTime: data.cacheTime || null,
            refresh: data.refresh || false,
            refreshEvery: data.refreshEvery || 0,
            limit: data.limit,
            offset: data.page,
            id: this.authStore.model()?.id || null,
            expand: data.expand || null,
            cacheKey: data.cacheKey,
          },
          session: this.sessionID,
        })
      );
    });
  }

  /**
   * @method delete
   * @param data
   * @returns  {Promise<any>}
   * @description Delete a record from a collection
   */
  public delete(data: {
    id: string;
    collection: string;
    filter?: string;
    cacheKey?: string;
  }) {
    return new Promise((resolve, reject) => {
      !data.collection ? reject(new Error("collection is required")) : null;
      !this.authStore.isValid ? reject(new Error("token is expired")) : null;
      let key = this.callback(resolve, reject);
      this.sendMessage(
        JSON.stringify({
          type: "delete",
          key: key,
          collection: data.collection,
          ownership: this.authStore.model().id,
          filter: data.filter,
          token: this.authStore.model().token,
          id: data.id || null,
          session: this.sessionID,
          cacheKey: data.cacheKey || null,
        })
      );
    });
  }

  /**
   * @description Set callback for response
   * @param resolve
   * @param reject
   */
  private callback(resolve: Function, reject: Function) {
    let caller = crypto.randomUUID();
    this.callbacks.set(caller, (data: any) => {
      if (data.error) reject(data);
      this.callbacks.delete(caller);
      resolve(data);
    });
    return caller;
  }
  /**
   * @method create
   * @param data
   * @returns  {Promise<any>}
   * @description Create a record in a collection
   */
  public async create(data: {
    collection: string;
    record: object;
    expand?: Array<string>;
    invalidateCache?: Array<string>;
    immediatelyUpdate?: boolean;
    cacheKey?: string;
  }) {
    return new Promise((resolve, reject) => {
      let key = `create-${crypto.randomUUID()}`
      !data.collection ? reject(new Error("collection is required")) : null;
      !data.record ? reject(new Error("record is required")) : null;
      if (data.collection !== "users" && !this.authStore.isValid) {
        reject(new Error("token is expired"));
      }
      this.callbacks.set(key, (data: any) => {
        if (data.error) reject(data);
        resolve(data);
      });
      console.log('sending create message')
      this.sendMessage(
        JSON.stringify({
          method: "create",
          type: "create",
          key:  key,
          invalidateCache: data.invalidateCache || null,
          expand: data.expand,
          record: data.record,
          collection: data.collection,
          token: this.authStore.model().token,
          id: this.authStore.model().id || null,
          session: this.sessionID,
          cacheKey: data.cacheKey || null,
        })
      );
    });
  }

  /**
   *
   * @param data
   * @param callback
   * @returns
   */
  public subscribe(
    data: { event: string; collection: string },
    callback: (data: subscribeOptions) => void
  ) {
    let key = crypto.randomUUID();
    if (!event) {
      throw new Error("event is required");
    }
    !data.collection ? new Error("collection is required") : null;
    !callback || typeof callback === "function"
      ? new Error("callback is required")
      : null;

    if (this.subscriptions.has(`${this.sessionID}-${data.collection}`)) return;
    this.callbacks.set(key, (d: any) => {
      if (d.error) throw new Error(d.error);
      callback(d);
    });
    this.subscriptions.set(`${this.sessionID}-${data.collection}`, true);
    console.log("Subscribing to event", data.event);
    this.sendMessage(
      JSON.stringify({
        type: "realtime",
        key: key,
        eventType: data.event,
        collection: data.collection,
        token: this.authStore.model().token,
        session: this.sessionID,
      })
    );
    return {
      unsubscribe: () => {
        this.callbacks.delete(key);
        this.sendMessage(
          JSON.stringify({
            type: "unsubscribe",
            key: key,
            session: this.sessionID,
          })
        );
      },
    };
  }
  public close() {
    this.ws.close();
  }
}
