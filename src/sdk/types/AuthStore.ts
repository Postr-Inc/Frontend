
export interface authStore {
    model(data?: any): model;
    onChange: Function;
    update: Function;
    refreshToken(): Promise<any>;
    clear: Function;
    create: (data: any) => Promise<any>;
    login: (emailOrUsername: string, password: string) => Promise<any>;
    requestPasswordReset: (email: string) => Promise<any>;
    resetPassword: (token: string, password: string) => Promise<any>;
    /**
     * @description Check if the token is valid
     * @param token 
     * @returns 
     */
    checkToken: (token: string) => Promise<any>;
    isValid: ( ) => boolean;
    img: Function;
    isRatelimited: Function;
    global: any;
}

export type isRatelimited = {
    
        error: boolean;
        ratelimited: boolean;
        duration: number;
        limit: number;
        used: number;
        key: string;
        session: string;
   
}
export interface model {
    id: string;
      avatar: string;
      username: string;
      created: string;
      updated: string;  
      followers: Array<string>;
      following: Array<string>;
      muted: Array<string>;
      plus_subscriber_since: string;
      socials: Array<string>;
      validVerified: boolean;
      deactivated: boolean;
      bookmarks: Array<string>;
      developer_account: boolean;
      location: string;
      token: string;
      bio: string;
      email: string;
      postr_plus: boolean;
}