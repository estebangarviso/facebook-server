import { Injectable } from '@core/decorators';
import { KeyNoValidException } from './exceptions/key-no-valid.exception';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisProvider {
    constructor(private _cache: Cache) {}

    /**
     * Gets a item from cache store.
     *
     * @template T
     * @param {string} key access key
     *
     * @throws {KeyNoValidException} on key falsy
     *
     * @returns {Promise<T | undefined>} item stored
     */
    get<T>(key: string): Promise<T | undefined> {
        if (!key) throw new KeyNoValidException();

        return this._cache.get<T>(key);
    }

    /**
     * Sets a new item to cache store.
     *
     * @template T
     * @param {string} key access key
     * @param {T} value item for set
     * @param {number} ttl time to live, value expiration in seconds
     *
     * @throws {KeyNoValidException} on key falsy
     *
     * @returns {Promise<T>} item stored
     */
    set<T>(key: string, value: T, ttl = 0): Promise<T> {
        if (!key) throw new KeyNoValidException();

        return this._cache.set<T>(key, value, { ttl });
    }

    /**
     * Deletes a item from cache store.
     *
     * @param {string} key access key
     */
    del(key: string): Promise<void> {
        if (!key) throw new KeyNoValidException();

        return this._cache.del(key);
    }

    /**
     * Clears all items from cache store.
     * @returns {Promise<void>}
     */
    reset(): Promise<void> {
        return this._cache.reset();
    }
}
