// actionService.js
let _handler = null;

export function registerActionHandler(fn) {
    _handler = fn;
}

export function unregisterActionHandler() {
    _handler = null;
}

export function callAction(action, row) {
    if (typeof _handler === "function") {
        return _handler(action, row);
    }
    console.warn("No action handler registered yet for", action, row);
}
