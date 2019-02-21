"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var pricer_1 = __importDefault(require("./pricer"));
var debt_1 = __importDefault(require("../model/debt"));
var glob = require("glob");
var parser = require("comment-parser");
var Collector = /** @class */ (function () {
    function Collector(scanningPath) {
        this.scanningPath = scanningPath;
        this.pricer = new pricer_1.default();
        this.debtScore = 0;
    }
    Collector.prototype.collect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var searchPattern, files, _i, files_1, file, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        searchPattern = this.scanningPath + '/**/*.*';
                        files = glob.sync(searchPattern);
                        _i = 0, files_1 = files;
                        _a.label = 1;
                    case 1:
                        if (!(_i < files_1.length)) return [3 /*break*/, 6];
                        file = files_1[_i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.parserFileWrapper(file)];
                    case 3:
                        data = _a.sent();
                        this.parseCommentsFromFile(data);
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/, this.debtScore];
                }
            });
        });
    };
    Collector.prototype.parserFileWrapper = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        parser.file(file, function (str, data) {
                            resolve(data);
                        });
                    })];
            });
        });
    };
    Collector.prototype.parseCommentsFromFile = function (data) {
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var commentBlock = data_1[_i];
            for (var _a = 0, _b = commentBlock.tags; _a < _b.length; _a++) {
                var comment = _b[_a];
                if (comment.tag.toLowerCase() === 'debt') {
                    var debt = debt_1.default.buildFromComment(comment);
                    this.debtScore += this.pricer.getPrice(debt);
                }
            }
        }
    };
    return Collector;
}());
exports.default = Collector;
