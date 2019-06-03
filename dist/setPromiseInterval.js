"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ids = new Set();
let id = 0;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function run(id, ...[handler, interval = 0]) {
    while (true) {
        if (!ids.has(id)) {
            break;
        }
        const startTime = new Date().getTime();
        await handler();
        await delay(interval - new Date().getTime() + startTime);
    }
}
function clearPromiseInterval(intervalId) {
    if (typeof intervalId === 'number') {
        ids.delete(intervalId);
    }
}
exports.clearPromiseInterval = clearPromiseInterval;
function setPromiseInterval(handler, interval) {
    id += 1;
    ids.add(id);
    run(id, handler, interval);
    return id;
}
exports.default = setPromiseInterval;
