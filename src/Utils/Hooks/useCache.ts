/**
 *  Cache hook using Cache API
 * @returns {set, get, remove, clear}
 */

export default function useCache() {
    const cacheName = "device-periscope-cache";

    const set = async (key: string, value: any, ttl: number) => {
        const cache = await caches.open(cacheName);
        const expires = Date.now() + ttl;
        const response = new Response(JSON.stringify({ value, expires }));
        await cache.put(new Request(key), response);
    }

    const get = async (key: string) => {
        const cache = await caches.open(cacheName);
        const response = await cache.match(new Request(key));
        if (!response) {
            return null;
        }
        const { value, expires } = await response.json();
        if (Date.now() > expires) {
            await cache.delete(new Request(key));
            return null;
        }
        return value;
    }

    const remove = async (key: string) => {
        const cache = await caches.open(cacheName);
        await cache.delete(new Request(key));
    }

    const clear = async () => {
        await caches.delete(cacheName);
    }

    // clear expired items periodically
    setInterval(async () => {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        const now = Date.now();
        for (const request of keys) {
            const response = await cache.match(request) as Response;
            const { expires } = await response.json() as any;
            if (expires < now) {
                await cache.delete(request);
            }
        }
    }, 1000);

    return { set, get, remove, clear };
}
