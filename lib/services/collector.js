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
var debtItem_1 = __importDefault(require("../model/debtItem"));
var debt_1 = __importDefault(require("../model/debt"));
var debtHistory_1 = __importDefault(require("../model/debtHistory"));
var dateHelper_1 = __importDefault(require("../utils/dateHelper"));
var glob = require("glob");
var fs = require('fs');
var nodeGit = require("nodegit");
var path = require("path");
var Collector = /** @class */ (function () {
    function Collector(scanningPath) {
        this.scanningPath = scanningPath;
    }
    Collector.prototype.collect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allNotHiddenFiles, notHiddenFiles, allHiddenFiles, hiddenFiles, allFiles, debt, _i, allFiles_1, fileName, file;
            return __generator(this, function (_a) {
                allNotHiddenFiles = this.scanningPath + '/**/*.*';
                notHiddenFiles = glob.sync(allNotHiddenFiles, { 'nodir': true });
                allHiddenFiles = this.scanningPath + '/**/.*';
                hiddenFiles = glob.sync(allHiddenFiles, { 'nodir': true });
                allFiles = notHiddenFiles.concat(hiddenFiles);
                debt = new debt_1.default();
                for (_i = 0, allFiles_1 = allFiles; _i < allFiles_1.length; _i++) {
                    fileName = allFiles_1[_i];
                    file = fs.readFileSync(fileName, 'utf-8');
                    this.parseFile(file, fileName, debt);
                }
                return [2 /*return*/, debt];
            });
        });
    };
    Collector.prototype.collectHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            var debtHistory, repository, firstCommitOnMaster, history, commits, _i, commits_1, commit, debt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debtHistory = new debtHistory_1.default();
                        return [4 /*yield*/, nodeGit.Repository.open(path.resolve(this.scanningPath))];
                    case 1:
                        repository = _a.sent();
                        return [4 /*yield*/, repository.getMasterCommit()];
                    case 2:
                        firstCommitOnMaster = _a.sent();
                        history = firstCommitOnMaster.history();
                        return [4 /*yield*/, this.getRelevantCommit(firstCommitOnMaster, history)];
                    case 3:
                        commits = _a.sent();
                        _i = 0, commits_1 = commits;
                        _a.label = 4;
                    case 4:
                        if (!(_i < commits_1.length)) return [3 /*break*/, 7];
                        commit = commits_1[_i];
                        return [4 /*yield*/, this.collectDebtFromCommit(commit)];
                    case 5:
                        debt = _a.sent();
                        debt.commitDateTime = commit.date();
                        debtHistory.addDebt(debt);
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, debtHistory];
                }
            });
        });
    };
    Collector.prototype.getRelevantCommit = function (firstCommit, history) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        history.on("end", function (commits) {
                            // We select one commit per day, the first one we meet
                            var startDate = firstCommit.date();
                            var startDateTime = startDate.getTime();
                            // @debt quality:variable "Maximet: We should create a const somewhere"
                            var endDateTime = startDateTime - 28 * 24 * 3600000;
                            var relevantCommits = new Map();
                            for (var _i = 0, commits_2 = commits; _i < commits_2.length; _i++) {
                                var commit = commits_2[_i];
                                if (commit.date().getTime() < endDateTime) {
                                    break;
                                }
                                var formattedDate = dateHelper_1.default.getDayMonthYearFormat(commit.date());
                                var commitOfTheDay = relevantCommits.get(formattedDate);
                                if (!commitOfTheDay) {
                                    relevantCommits.set(formattedDate, commit);
                                }
                            }
                            return resolve(Array.from(relevantCommits.values()));
                        });
                        history.start();
                    })];
            });
        });
    };
    Collector.prototype.collectDebtFromCommit = function (commit) {
        return __awaiter(this, void 0, void 0, function () {
            var debt, entries, _i, entries_1, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debt = new debt_1.default();
                        return [4 /*yield*/, this.getFilesFromCommit(commit)];
                    case 1:
                        entries = _a.sent();
                        _i = 0, entries_1 = entries;
                        _a.label = 2;
                    case 2:
                        if (!(_i < entries_1.length)) return [3 /*break*/, 5];
                        entry = entries_1[_i];
                        return [4 /*yield*/, this.parseEntry(entry, debt)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, debt];
                }
            });
        });
    };
    Collector.prototype.getFilesFromCommit = function (commit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        var tree = commit.getTree();
                        tree.then(function (tree) {
                            var walker = tree.walk(true);
                            var entryArray = Array();
                            walker.on("entry", function (entry) {
                                entryArray.push(entry);
                            });
                            walker.on("end", function (entries) {
                                return resolve(entryArray);
                            });
                            // Don't forget to call `start()`!
                            walker.start();
                        });
                    })];
            });
        });
    };
    Collector.prototype.parseEntry = function (entry, debt) {
        return __awaiter(this, void 0, void 0, function () {
            var those;
            return __generator(this, function (_a) {
                those = this;
                return [2 /*return*/, new Promise((function (resolve) {
                        var blob = entry.getBlob();
                        blob
                            .then(function (blob) {
                            those.parseFile(String(blob), entry.path(), debt);
                            resolve();
                        })
                            .catch((function (reason) { return console.error('Error while parsing the blob of the file', reason); }));
                    }))];
            });
        });
    };
    Collector.prototype.parseFile = function (file, fileName, debt) {
        var _this = this;
        var lines = file.split('\n');
        /**
         * @debt bug-risk:detection "Maximet: check if the line is a comment or not to avoid wrong debt detection"
         */
        lines = lines.filter(function (line) { return line.indexOf('@debt') >= 0 && _this.checkIfLineIsAComment(line); });
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var debtItem = this.parseDebtItemFromDebtLine(line, fileName);
            debt.addDebtItem(debtItem);
        }
    };
    Collector.prototype.checkIfLineIsAComment = function (line) {
        var lineTrimed = line.trim();
        var firstChar = lineTrimed.charAt(0);
        return firstChar === '#' || firstChar === '*' || firstChar === '/';
    };
    Collector.prototype.parseDebtItemFromDebtLine = function (line, fileName) {
        var lineWithoutDebt = line.substr(line.indexOf('@debt') + 6);
        var indexOfComment = lineWithoutDebt.indexOf('"');
        var debtTypesExpression = lineWithoutDebt.substr(0, indexOfComment).trim();
        var types = debtTypesExpression.split(':');
        var debtType = types[0];
        var debtCategory = types[1] ? types[1] : '';
        var comment = line.substr(line.indexOf('"') + 1);
        if (comment.indexOf('"') >= 0) {
            comment = comment.substr(0, comment.indexOf('"'));
        }
        return new debtItem_1.default(debtType, debtCategory, comment, fileName);
    };
    return Collector;
}());
exports.default = Collector;
