"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.measure = void 0;
var playwright_1 = require("playwright");
var measure = function (urls) { return __awaiter(void 0, void 0, void 0, function () {
    var browser, context, page, results, reqCount, resCount, lastURL, _i, urls_1, url;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, playwright_1.chromium.launch()];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newContext()];
            case 2:
                context = _a.sent();
                return [4 /*yield*/, context.newPage()];
            case 3:
                page = _a.sent();
                results = [];
                reqCount = 0;
                resCount = 0;
                // Record start time for each request
                page.on('request', function (request) {
                    reqCount++;
                });
                // Calculate response time and log it along with response headers
                page.on('response', function (response) { return __awaiter(void 0, void 0, void 0, function () {
                    var url, request, timing, headers, protocol;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                reqCount++;
                                url = response.url();
                                request = response.request();
                                timing = request.timing();
                                headers = response.headers();
                                return [4 /*yield*/, response.headerValue('x-protocol')];
                            case 1:
                                protocol = (_a.sent()) || "";
                                // Wait for the response to finish downloading
                                return [4 /*yield*/, response.finished().catch(console.error)];
                            case 2:
                                // Wait for the response to finish downloading
                                _a.sent();
                                results.push({
                                    url: url,
                                    protocol: protocol,
                                    timing: timing,
                                    headers: headers
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
                lastURL = "";
                _i = 0, urls_1 = urls;
                _a.label = 4;
            case 4:
                if (!(_i < urls_1.length)) return [3 /*break*/, 9];
                url = urls_1[_i];
                if (!(url === lastURL)) return [3 /*break*/, 6];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 60000); })];
            case 5:
                _a.sent(); // wait for connection to close
                _a.label = 6;
            case 6: // wait for connection to close
            return [4 /*yield*/, page.goto(url).catch(function (e) { return console.error('Error navigating to page', e); })];
            case 7:
                _a.sent();
                lastURL = url;
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 4];
            case 9: 
            // Click the "downloadVideo" button, which will only execute on last page
            return [4 /*yield*/, page.click('#downloadVideo').catch(function (e) { return console.error('Error clicking button', e); })];
            case 10:
                // Click the "downloadVideo" button, which will only execute on last page
                _a.sent();
                _a.label = 11;
            case 11:
                if (!(reqCount !== resCount)) return [3 /*break*/, 13];
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 12:
                _a.sent(); // wait until all responses have resolved
                return [3 /*break*/, 11];
            case 13: return [4 /*yield*/, browser.close().finally(function () { return console.log('Browser closed'); })];
            case 14:
                _a.sent();
                return [2 /*return*/, results];
        }
    });
}); };
exports.measure = measure;
