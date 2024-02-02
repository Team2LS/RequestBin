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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRequestFromBin = exports.getAllBins = exports.createBin = exports.saveRequest = exports.getBinId = void 0;
const pg = __importStar(require("pg"));
const Client = pg.Client;
const CONNECTION = {
    host: "/var/run/postgresql",
    port: 5432,
    user: "emargetis",
    database: "rhh"
};
function getBinId(urlPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new Client(CONNECTION);
        yield client.connect();
        const result = yield client.query("SELECT * FROM bins WHERE url_path = $1", [urlPath]);
        yield client.end();
        if (result.rowCount != 1) {
            return undefined;
        }
        else {
            return result.rows[0].id;
        }
    });
}
exports.getBinId = getBinId;
function saveRequest(mongoId, binId, http_method, http_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new Client(CONNECTION);
        yield client.connect();
        yield client.query("INSERT INTO requests (mongo_id, bin_id, http_method, http_path) VALUES ($1, $2, $3, $4);", [mongoId, binId, http_method, http_path]);
        yield client.end();
    });
}
exports.saveRequest = saveRequest;
function createBin(urlPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new Client(CONNECTION);
        yield client.connect();
        yield client.query("INSERT INTO bins (url_path) VALUES ($1);", [urlPath]);
        yield client.end();
    });
}
exports.createBin = createBin;
function getAllBins() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new Client(CONNECTION);
        yield client.connect();
        let result = (yield client.query("SELECT * FROM bins;")).rows;
        yield client.end();
        return result;
    });
}
exports.getAllBins = getAllBins;
function getAllRequestFromBin(urlPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new Client(CONNECTION);
        yield client.connect();
        let result = (yield client.query("SELECT * FROM bins JOIN requests ON bins.id = requests.bin_id WHERE bins.url_path = $1;", [urlPath])).rows;
        yield client.end();
        return result;
    });
}
exports.getAllRequestFromBin = getAllRequestFromBin;
