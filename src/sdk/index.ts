"use client";
import { isTokenExpired } from "./jwt/index";
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

interface authStore {
  model: {
    id: string;
    avatar: string;
    username: string;
    created: string;
    updated: string;

    token: string;
  };
  onChange: Function;
  update: Function;
  clear: Function;
  isValid: Function;
  img: Function;
  isRatelimited: Function;
  global: any;
}

interface isRatelimited {
  limit: number;
  duration: number;
  used: number;
  ratelimited: boolean;
}

/**
 * @class PostrSDK
 * @description PostrSDK - the official Postr hapta client sdk
 * @version v0.0.4
 */

export default class postrSdk {
  private ws: WebSocket;
  private sendMessage: (e: any) => void;
  private callbacks: Map<string, any>;
  private isStandalone: boolean;
  onlineEvent: CustomEvent;
  changeEvent: CustomEvent;
  cancellation: any;
  online: Map<string, any>;
  sessionID: string;
  pbUrl: string;
  currType: string;
  private $memoryCache: Map<string, any>;
  token: string;
  constructor(data: { wsUrl: string; pbUrl: string; cancellation: any }) {
    this.onlineEvent = new CustomEvent("online");
    this.changeEvent = new CustomEvent("change");
    this.sessionID = crypto.randomUUID(); 
    this.isStandalone = false;
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
    window.postr = {
      version: " 1.7.0",
    };
    this.token = JSON.parse(store.get("postr_auth") || "{}")
      ? JSON.parse(store.get("postr_auth") || "{}").token
      : null;
    /**
     * @param {boolean} cancellation
     * @description cancel request if taking too long
     */
    this.cancellation = data.cancellation;
    this.sendMessage = (e) => {
      this.waitForSocketConnection(() => {
        this.ws.send(e);
      });
    };
    this.currType = "";
    this.pbUrl = data.pbUrl;
    this.callbacks = new Map();
    this.ws.onmessage = (e) => this.onmessage(e);

    this.ws.onopen = () => {
      this.ws.send(
        JSON.stringify({
          type: "authSession",
          token: this.token,
          session: this.sessionID,
        })
      );

      setInterval(() => {
        if (this.authStore.isValid())
          this.ws.send(
            JSON.stringify({
              type: "ping",
              token: this.token,
              session: this.sessionID,
              time: Date.now(),
            })
          );
      }, 1000);
    };

    this.ws.onclose = () => {
      this.ws = new WebSocket(
        `${
          data.wsUrl.trim().startsWith("127") ||
          data.wsUrl.trim().startsWith("localhost")
            ? "ws"
            : "wss"
        }://${data.wsUrl}`
      );
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

  checkConnection() {
    if (this.ws.readyState === WebSocket.OPEN) return true;
    else return false;
  }

  public search(data: {
    collection: string;
    query: any;
    expand?: String[];
    limit?: number;
    page?: number;
    cacheKey?: string;
  }) {
    return new Promise((resolve, reject) => {
      let key = crypto.randomUUID();
      !data.collection ? reject(new Error("collection is required")) : null;
      !this.authStore.isValid ? reject(new Error("token is expired")) : null;

      this.callbacks.set(key, (responseData: any) => {
        if (responseData.error) reject(new Error(JSON.stringify(responseData)));
        else resolve(responseData);
        this.callbacks.delete(key);
      });

      let query = "";
      Object.keys(data.query).forEach((key, index) => {
        if (index === 0) query += `${key}?~"${data.query[key]}"`;
        else query += `&&${key}?~${data.query[key]}`;
      });
      this.sendMessage(
        JSON.stringify({
          type: "search",
          key: key,
          token: this.token,
          data: {
            collection: data.collection,
            query: query,
            cacheKey: data.cacheKey || null,
            limit: data.limit,
            offset: data.page,
            id: this.authStore.model()?.id || null,
            expand: data.expand || null,
          },
          session: this.sessionID,
        })
      );
    });
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
            token: this.token,
            session: this.sessionID,
          })
        );
      });
    },
  };

  /**
   * @method cacehStore
   * @description Cache values with exp duration in ms
   * @returns {cacehStore}
   */
  cacehStore = {
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

  /**
   * @method authStore
   * @description Get the current authmodel data and listen for changes
   * @returns {authStore}
   *
   */
  public authStore = {
    update: () => {
      if (typeof window == "undefined" || !localStorage.getItem("postr_auth"))
        return;
      this.callbacks.set("authUpdate", (data: any) => {
        if (data.error && data.hasOwnProperty("isValid") && !data.isValid) {
          this.authStore.clear();
        } else if (data.error) { 
          throw new Error(data);
        } else if (data.clientData){  
          localStorage.setItem(
            "postr_auth",
            JSON.stringify({
              model: data.clientData,
              token: this.token
            })
          ); 
        } 
      });
      this.sendMessage(
        JSON.stringify({
          type: "authUpdate",
          token: this.token,
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
    model: () => {
      if (typeof window == "undefined") return;
      return JSON.parse(store.get("postr_auth") || "{}").model;
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
      let token = localStorage.getItem("postr_auth")
        ? JSON.parse(store.get("postr_auth") || "{}").token
        : null;
       if(!token) return false;
        return isTokenExpired(token) ? false : true;
    },
    img: () => {
      if (typeof window == "undefined") return;
      return `${this.pbUrl}/api/files/users/${this.authStore.model().id}/${
        this.authStore.model().avatar
      }`;
    },
    /**
     * @method isRatelimited
     * @description Check if the current token is ratelimited
     * @param type
     * @returns
     */
    isRatelimited: (type: string): Promise<isRatelimited> => {
      return new Promise((resolve, reject) => {
        this.callbacks.set("isRatelimited", (data: any) => {
          if (data.error) reject(data.error);
          resolve(data);
          this.callbacks.delete("isRatelimited");
        });
        this.sendMessage(
          JSON.stringify({
            type: "isRatelimited",
            key: "isRatelimited",
            token: this.token,
            method: type,
            session: this.sessionID,
          })
        );
      });
    },
    clear: () => {
      if (typeof window == "undefined") return;
      store.remove("postr_auth");
      window.dispatchEvent(this.changeEvent);
    },
  };

  async checkUsername(username: string) {
    return new Promise((resolve, reject) => {
      this.callbacks.set("checkUsername", (data: any) => {
        if (data.error) reject(data.error);
        resolve(data.message);
        this.callbacks.delete("checkUsername");
      });
      this.sendMessage(
        JSON.stringify({
          type: "checkUsername",
          key: "checkUsername",
          data: { username: username },
          token: this.token,
          session: this.sessionID,
        })
      );
    });
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
      if (!emailOrUsername) {
        throw new Error("email or username is required");
      } else if (!password) {
        throw new Error("password is required");
      } else {
        this.callbacks.set("auth&password", (data: any) => {
          if (data.clientData) {
            if (typeof window == "undefined") return;
            if (typeof window !== undefined)
              localStorage.setItem(
                "postr_auth",
                JSON.stringify({
                  model: data.clientData,
                  token: data.clientData.token,
                })
              );
            resolve(data.clientData);
            this.callbacks.delete("auth&password");
            window.dispatchEvent(this.changeEvent);
          } else if (data.error) {
            reject(new Error(data.error));
            this.callbacks.delete("auth&password");
          }
        });
        this.sendMessage(
          JSON.stringify({
            type: "auth&password",
            data: { emailOrUsername: emailOrUsername, password: password },
            key: "auth&password",
          })
        );
      }
    });
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
            reject(new Error(data.error));
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
    }   else if (data.type === "status") {
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

  public read(data: {
    id: string;
    collection: string;
    returnable?: Array<string>;
    expand?: Array<string>;
    authKey?: string;
  }) {
    return new Promise((resolve, reject) => {
      let key = crypto.randomUUID();
      !data.collection ? reject(new Error("collection is required")) : null;
      !this.authStore.isValid ? reject(new Error("token is expired")) : null;

      this.callbacks.set(key, (responseData: any) => {
        if (responseData.error) {
          reject(responseData);
        } else {
          resolve(responseData);
        }
        this.callbacks.delete(key);
      });

      this.sendMessage(
        JSON.stringify({
          type: "read",
          key: key,
          collection: data.collection,
          token: this.token,
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
    expand?: Array<string>;
    cacheKey?: string;
  }) {
    return new Promise((resolve, reject) => {
      let key = crypto.randomUUID();
      !data.collection ? reject(new Error("collection is required")) : null;
      !data.record ? reject(new Error("data is required")) : null;
      !this.authStore.isValid ? reject(new Error("token is expired")) : null;

      this.callbacks.set(key, (data: any) => {
        if (data.error) reject(data);
        resolve(data);
        this.callbacks.delete(key);
      });

      this.sendMessage(
        JSON.stringify({
          type: "update",
          key: key,
          data: data.record,
          expand: data.expand,
          collection: data.collection,
          sort: data.sort,
          filter: data.filter,
          token: this.token,
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
    cacheKey?: string;
    cacheTime?: number;
  }) {
    return new Promise((resolve, reject) => {
      let key = crypto.randomUUID();
      this.currType = "list";
      !data.collection ? reject(new Error("collection is required")) : null;
      !this.authStore.isValid ? reject(new Error("token is expired")) : null;

      this.callbacks.set(key, (responseData: any) => {
        if (responseData.error) reject(responseData);
        else resolve(responseData);
        this.callbacks.delete(key);
      });
      this.sendMessage(
        JSON.stringify({
          type: "list",
          key: key,
          token: this.token,
          data: {
            returnable: data.returnable || null,
            collection: data.collection,
            sort: data.sort,
            filter: data.filter,
            cacheTime: data.cacheTime || null,
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
      let key = crypto.randomUUID();
      !data.collection ? reject(new Error("collection is required")) : null;
      !this.authStore.isValid ? reject(new Error("token is expired")) : null;
      this.callbacks.set(key, (data: any) => {
        if (data.error) reject(data);
        resolve(data);
      });

      this.sendMessage(
        JSON.stringify({
          type: "delete",
          key: key,
          collection: data.collection,
          ownership: this.authStore.model().id,
          filter: data.filter,
          token: this.token,
          id: data.id || null,
          session: this.sessionID,
          cacheKey: data.cacheKey || null,
        })
      );
    });
  }
  /**
   * @method create
   * @param data
   * @returns  {Promise<any>}
   * @description Create a record in a collection
   */
  public create(data: {
    collection: string;
    record: object;
    expand: Array<string>;
    cacheKey?: string;
  }) {
    return new Promise((resolve, reject) => {
      let key = crypto.randomUUID();
      !data.collection ? reject(new Error("collection is required")) : null;
      !data.record ? reject(new Error("record is required")) : null;
      if (data.collection !== "users" && !this.authStore.isValid) {
        reject(new Error("token is expired"));
      }
      this.callbacks.set(key, (data: any) => {
        if (data.error) reject(new Error(data));
        resolve(data);
      });

      this.sendMessage(
        JSON.stringify({
          method: "create",
          type: "create",
          key: key,
          expand: data.expand,
          record: data.record,
          collection: data.collection,
          token: this.token || null,
          id: this.authStore.model().id || null,
          session: this.sessionID,
          cacheKey: data.cacheKey || null,
        })
      );
    });
  }

  public on(
    data: { event: string; id: string; collection: string },
    callback: Function
  ) {
    let key = crypto.randomUUID();
    if (!event) {
      throw new Error("event is required");
    }
    !data.collection ? new Error("collection is required") : null;
    !callback || typeof callback === "function"
      ? new Error("callback is required")
      : null;
    if (!data.id) throw new Error("id is required");

    this.callbacks.set(key, (d: any) => {
      if (d.error) throw new Error(d.error);
      callback(d);
    });
    this.sendMessage(
      JSON.stringify({
        type: "subscribe",
        key: key,
        eventType: data.event,
        collection: data.collection,
        id: data.id,
        token: this.token,
      })
    );
    return {
      unsubscribe: () => {
        this.callbacks.delete(key);
      },
    };
  }
  public close() {
    this.ws.close();
  }
}
