"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getData_1 = require("./getData");
var firebaseAdmin = __importStar(require("firebase-admin"));
var admin_json_1 = __importDefault(require("../../keys/admin.json"));
var http1URLs = [
    "https://vm1.research.letswhirl.com:444",
    "https://vm2.research.letswhirl.com:444",
    "https://vm3.research.letswhirl.com:444",
    "https://vm4.research.letswhirl.com:444",
    "https://vm5.research.letswhirl.com:444",
    "https://vm6.research.letswhirl.com:444",
    "https://vm7.research.letswhirl.com:444",
];
var http2URLs = [
    "https://vm1.research.letswhirl.com:442",
    "https://vm2.research.letswhirl.com:442",
    "https://vm3.research.letswhirl.com:442",
    "https://vm4.research.letswhirl.com:442",
    "https://vm5.research.letswhirl.com:442",
    "https://vm6.research.letswhirl.com:442",
    "https://vm7.research.letswhirl.com:442",
];
var http3URLs = [
    "https://vm1.research.letswhirl.com",
    "https://vm2.research.letswhirl.com",
    "https://vm3.research.letswhirl.com",
    "https://vm4.research.letswhirl.com",
    "https://vm5.research.letswhirl.com",
    "https://vm6.research.letswhirl.com",
    "https://vm7.research.letswhirl.com",
];
var forceHTTP3URLs = [
    "https://vm1.research.letswhirl.com/ping",
    "https://vm2.research.letswhirl.com/ping",
    "https://vm3.research.letswhirl.com/ping",
    "https://vm4.research.letswhirl.com/ping",
    "https://vm5.research.letswhirl.com/ping",
    "https://vm6.research.letswhirl.com/ping",
    "https://vm7.research.letswhirl.com/ping",
];
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var currentTime, getHttp1Results, getHttp2Results, getHttp3Results, funcs, results, _i, getHttp1Results_1, f, _a, data, url, _b, getHttp2Results_1, f, _c, data, url, _d, getHttp3Results_1, f, _e, data, url;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                currentTime = Date.now().toString();
                getHttp1Results = http1URLs.map(function (url) { return function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, (0, getData_1.getData)({ url: url })];
                }); }); }; });
                getHttp2Results = http2URLs.map(function (url) { return function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, (0, getData_1.getData)({ url: url })];
                }); }); }; });
                getHttp3Results = http3URLs.map(function (url, index) { return function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, (0, getData_1.getData)({ url: url, forceHTTP3URL: forceHTTP3URLs[index] })];
                }); }); }; });
                funcs = [getHttp1Results, getHttp2Results, getHttp3Results].flat();
                results = {};
                _i = 0, getHttp1Results_1 = getHttp1Results;
                _f.label = 1;
            case 1:
                if (!(_i < getHttp1Results_1.length)) return [3 /*break*/, 5];
                f = getHttp1Results_1[_i];
                return [4 /*yield*/, f()];
            case 2:
                _a = _f.sent(), data = _a[0], url = _a[1];
                results["http1-".concat(url)] = data;
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
            case 3:
                _f.sent();
                _f.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5:
                _b = 0, getHttp2Results_1 = getHttp2Results;
                _f.label = 6;
            case 6:
                if (!(_b < getHttp2Results_1.length)) return [3 /*break*/, 10];
                f = getHttp2Results_1[_b];
                return [4 /*yield*/, f()];
            case 7:
                _c = _f.sent(), data = _c[0], url = _c[1];
                results["http2-".concat(url)] = data;
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
            case 8:
                _f.sent();
                _f.label = 9;
            case 9:
                _b++;
                return [3 /*break*/, 6];
            case 10:
                _d = 0, getHttp3Results_1 = getHttp3Results;
                _f.label = 11;
            case 11:
                if (!(_d < getHttp3Results_1.length)) return [3 /*break*/, 15];
                f = getHttp3Results_1[_d];
                return [4 /*yield*/, f()];
            case 12:
                _e = _f.sent(), data = _e[0], url = _e[1];
                results["http3-".concat(url)] = data;
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 2000); })];
            case 13:
                _f.sent();
                _f.label = 14;
            case 14:
                _d++;
                return [3 /*break*/, 11];
            case 15:
                // for (const f of funcs) {
                //     const [data, url] = await f()
                //     switch (run) {
                //         case 0:
                //             results["http1Results"] = r
                //             break;
                //         case 1:
                //             results["http2Results"] = r
                //             break;
                //         case 2:
                //             results["http3Results"] = r
                //             break;
                //     }
                //     run++;
                //     await new Promise(resolve => setTimeout(resolve, 2000));
                // }
                firebaseAdmin.initializeApp({
                    credential: firebaseAdmin.credential.cert(admin_json_1.default),
                });
                return [4 /*yield*/, firebaseAdmin.firestore().collection("results").doc(currentTime).set(results)
                    // const results = {http1Results, http2Results, http3Results}
                    // console.log("HTTP3 Results: ", http3Results)
                    // console.log("HTTP2 Results: ", http2Results)
                    // console.log("HTTP1 Results: ", http1Results)
                ];
            case 16:
                _f.sent();
                return [2 /*return*/];
        }
    });
}); })();
