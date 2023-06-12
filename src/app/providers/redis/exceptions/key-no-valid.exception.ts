/**
 * Thrown on key null or undefined.
 *
 * @tip exceptions are expected behavior on certain situations,
 *  meanwhile errors are critical problems should stop application.
 *
 * @class KeyNoValidException
 * @extends {Exception}
 */
export class KeyNoValidException extends Error {
    /**
     * Creates an instance of KeyNoValidException.
     */
    constructor() {
        super('Key cannot be null or undefined');
    }
}
