"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputOfDay = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const sync_request_1 = __importDefault(require("sync-request"));
const cookiePath = (0, path_1.join)(__dirname, '../sessionCookie.txt');
const cookieString = (0, fs_1.readFileSync)(cookiePath, 'utf8');
if (require.main === module) {
    const day = process.argv[2];
    const year = process.argv[3];
    getInputOfDay(day, year);
}
function getInputOfDay(day, year) {
    const url = `https://adventofcode.com/${year}/day/${day}/input`;
    const response = (0, sync_request_1.default)('GET', url, {
        headers: {
            Cookie: cookieString,
            'user-agent': 'https://github.com/andrewgreenh/advent-of-code/blob/master/TypeScript/load.ts',
        },
    });
    if (response.statusCode === 404)
        throw new Error('Not ready!');
    const input = response.body.toString();
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, `src/${year}/${day}.txt`), input);
    console.log(`File written successfully: ${year}/${day}.txt`);
    return input;
}
exports.getInputOfDay = getInputOfDay;
//# sourceMappingURL=load.js.map