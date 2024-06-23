 //@ts-nocheck

var atobPolyfill: Function;

if (typeof atob === 'function') {
    atobPolyfill = atob;
} else {
    // Base64 polyfill for browsers that don't have atob
    atobPolyfill = function(input: string) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        var str = String(input).replace(/=+$/, "");
        if (str.length % 4 == 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }

        var output = "";
        var buffer, bs, bc, idx = 0;

        while ((buffer = str.charAt(idx++))) {
            buffer = chars.indexOf(buffer);

            if (buffer === -1) {
                continue;
            }

            //@ts-ignore
            bs = bc % 4 ? bs * 64 + buffer : buffer;

            if (bc++ % 4) {
                output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
            }
        }

        return output;
    };
}

/**
 * Returns JWT token's payload data.
 */
function getTokenPayload(token: string) {
    if (token) {
        try {
            var encodedPayload = decodeURIComponent(
                atobPolyfill(token.split('.')[1])
                    .split('')
                    .map(function(c: string) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join('')
            );

            return JSON.parse(encodedPayload) || {};
        } catch (e) {
            console.error('Error decoding token payload:', e);
        }
    }

    return {};
}

/**
 * Checks whether a JWT token is expired or not.
 * Tokens without `exp` payload key are considered valid.
 * Tokens with empty payload (eg. invalid token strings) are considered expired.
 *
 * @param token The token to check.
 * @param expirationThreshold Time in seconds that will be subtracted from the token `exp` property.
 */
export function isTokenExpired(token: string, expirationThreshold: number = 0) {
    var decoded = getTokenPayload(token);

    var exp = decoded.exp;
    if (!exp) {
        // Token does not have an expiration time, so it's considered valid
        return false;
    }

    // Calculate if the token expiration time is past the current time minus expiration threshold
    var isExpired = Date.now() >= exp * 1000 - expirationThreshold * 1000;

    return isExpired;
}
