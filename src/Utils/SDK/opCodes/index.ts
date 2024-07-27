export const enum ErrorCodes { 
    // 400 - 499  
    INVALID_REQUEST = 400, 
    INVALID_OR_MISSING_TOKEN = 401,
    FIELD_MISSING = 402,  
    AUTHORIZATION_FAILED = 403, 
    NOT_FOUND = 404,
    MISSING_EMAIL_OR_USERNAME = 405,
    MISSING_PASSWORD = 406,
    MISSING_IP_ADDRESS = 407,
    REFRESH_TOKEN_FAILED = 408,
    RATE_LIMIT = 409, 
    UNAUTHORIZED_REQUEST = 410,
    // 500 - 599
    DATABASE_ERROR = 500, 
    DATABASE_AUTH_FAILED = 501, 
    CONFIGURATION_ERROR = 502, 
    SYSTEM_ERROR = 503,
}

export const enum GeneralCodes {
    SUCCESS = 2000,
    AUTHORIZED = 2001,
    CREATED = 2010,
    ACCEPTED = 2020,
    UPDATED = 2030,
    DELETED = 2040, 
}


export const enum ErrorTypes {
    SYSTEM_ERROR = 'system',
    AUTH_ERROR = 'auth',
    RATE_LIMIT = 'rate',
    DATABASE_ERROR = 'database',
    INVALID_REQUEST = 'invalid',
}

export  enum HttpCodes {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    MOVED_PERMANENTLY = 301,
 }

export const ErrorMessages = {
   [ErrorCodes.SYSTEM_ERROR]: 'System Error',
   [ErrorCodes.INVALID_OR_MISSING_TOKEN]: 'Invalid or missing token',
   [ErrorCodes.FIELD_MISSING]: 'Required fields is missing',
   [ErrorCodes.RATE_LIMIT]: 'Current request has been rate limited',
   [ErrorCodes.AUTHORIZATION_FAILED]: 'Authorization failed', 
   [ErrorCodes.DATABASE_ERROR]: 'Database error',
   [ErrorCodes.INVALID_REQUEST]: 'Invalid request',
   [ErrorCodes.REFRESH_TOKEN_FAILED]: 'Failed to refresh token likely due to an invalid token',
   [ErrorCodes.NOT_FOUND]: 'Not found',
   [ErrorCodes.DATABASE_AUTH_FAILED]: 'Database authentication failed',
   [ErrorCodes.MISSING_EMAIL_OR_USERNAME]: 'Email or username is missing',
   [ErrorCodes.MISSING_PASSWORD]: 'Password is missing',
   [ErrorCodes.MISSING_IP_ADDRESS]: 'IP Address is missing',
   [ErrorCodes.UNAUTHORIZED_REQUEST]: 'Unauthorized request',
    
}