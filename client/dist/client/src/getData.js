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
exports.getData = void 0;
var playwright_1 = require("playwright");
var getData = function (_a) {
    var url = _a.url, forceHTTP3URL = _a.forceHTTP3URL, logActivity = _a.logActivity;
    return __awaiter(void 0, void 0, void 0, function () {
        var log, getLossRateFromArgs, browser, context, page, reqCount, resCount, waitUntilAllRequestsFinished, results, openPage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    log = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        if (logActivity)
                            console.log.apply(console, args);
                    };
                    getLossRateFromArgs = function () {
                        var args = process.argv;
                        if (args.includes('--loss-rate')) {
                            var index = args.indexOf('--loss-rate');
                            var lossRate = args[index + 1];
                            if (lossRate) {
                                return lossRate;
                            }
                        }
                    };
                    return [4 /*yield*/, playwright_1.firefox.launch()];
                case 1:
                    browser = _b.sent();
                    return [4 /*yield*/, browser.newContext({
                            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36 Edg/96.0.1054.29+HTTP/3',
                        })];
                case 2:
                    context = _b.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _b.sent();
                    reqCount = 0;
                    resCount = 0;
                    waitUntilAllRequestsFinished = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(reqCount !== resCount)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                                case 1:
                                    _a.sent(); // wait until all responses have resolved
                                    return [3 /*break*/, 0];
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); };
                    results = [];
                    page.on('request', function (request) {
                        log("Request Initiated: ".concat(request.url()));
                        reqCount++;
                    });
                    page.on('response', function (response) { return __awaiter(void 0, void 0, void 0, function () {
                        var url, request, timing, headers, protocol;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    log("Receiving Response: ".concat(response.url()));
                                    url = response.url();
                                    request = response.request();
                                    timing = request.timing();
                                    headers = response.headers();
                                    return [4 /*yield*/, response.headerValue('x-protocol')];
                                case 1:
                                    protocol = (_a.sent()) || "";
                                    // Wait for the response to finish downloading
                                    return [4 /*yield*/, response.finished()];
                                case 2:
                                    // Wait for the response to finish downloading
                                    _a.sent();
                                    resCount++;
                                    log("Response Finished: ".concat(response.url()));
                                    results.push({
                                        url: url,
                                        protocol: protocol,
                                        timing: timing,
                                        headers: headers,
                                        lossRate: getLossRateFromArgs()
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    openPage = function (url) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, page.goto(url).catch(function (e) { return console.error('Error navigating to page', e); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!forceHTTP3URL) return [3 /*break*/, 6];
                    return [4 /*yield*/, openPage(forceHTTP3URL).catch(function (e) { return console.error('Error navigating to page', e); })];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6: return [4 /*yield*/, openPage(url).catch(function (e) { return console.error('Error navigating to page', e); })];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, page.click('#downloadVideo').catch(function (e) { return console.error('Error clicking button', e); })];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, waitUntilAllRequestsFinished()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, browser.close()];
                case 10:
                    _b.sent();
                    return [2 /*return*/, results];
            }
        });
    });
};
exports.getData = getData;
