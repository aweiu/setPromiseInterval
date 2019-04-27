"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ids = {};
let id = 0;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function run(id, ...[handler, interval = 0]) {
    while (true) {
        if (!ids.hasOwnProperty(id)) {
            break;
        }
        const startTime = new Date().getTime();
        await handler();
        await delay(interval - new Date().getTime() + startTime);
    }
}
function clearPromiseInterval(intervalId) {
    delete ids[intervalId];
}
exports.clearPromiseInterval = clearPromiseInterval;
function setPromiseInterval(handler, interval) {
    id += 1;
    ids[id] = null;
    run(id, handler, interval);
    return id;
}
exports.default = setPromiseInterval;
