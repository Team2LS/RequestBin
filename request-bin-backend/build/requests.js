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
const express = __importStar(require("express"));
const requestsRouter = express.Router();
const mongodb_1 = require("./services/mongodb");
const psql_1 = require("./services/psql");
const helpers_1 = require("./helpers");
const BIN_URL_PATH_LENGTH = 12;
// get a payload from mongoDB
requestsRouter.get('/api/payload/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    let payload = null;
    try {
        payload = yield (0, mongodb_1.getPayloadById)(id);
        if (payload === null) {
            throw new Error(`Error: Unable to retrieve payload with ID '${id}'`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
    }
    res.json(payload);
}));
// saves payload to mongoDB and request to postgres
requestsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req || !req.headers || !req.headers.host) {
            throw new Error(`Invalid or missing host name`);
        }
        const urlPath = req.headers.host.split('.')[0];
        const binId = yield (0, psql_1.getBinId)(urlPath);
        const req_method = req.method ? req.method : "";
        if (!binId) {
            throw new Error(`Invalid bin URL path ${urlPath}`);
        }
        const mongoId = yield (0, mongodb_1.savePayload)(req);
        yield (0, psql_1.saveRequest)(mongoId, binId, req_method, urlPath);
        console.log(`Created new webhook entry: [URL path]:${urlPath} [Bin ID]:${binId} [Mongo ID]:${mongoId}`);
        res.status(202).send({ success: true });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
    }
}));
// create new bin in postgres
requestsRouter.post('/api/bin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let urlPath = (0, helpers_1.makeUrlPath)(BIN_URL_PATH_LENGTH);
    try {
        const allBins = yield (0, psql_1.getAllBins)();
        const allBinPaths = allBins.flatMap(({ url_path }) => url_path);
        while (allBinPaths.includes(urlPath)) {
            urlPath = (0, helpers_1.makeUrlPath)(BIN_URL_PATH_LENGTH);
        }
        yield (0, psql_1.createBin)(urlPath);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
    }
    res.send(urlPath);
}));
// get all bins from postgres
requestsRouter.get('/api/bins', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBins = yield (0, psql_1.getAllBins)();
        res.status(200).send(allBins);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        }
    }
}));
// get all requests for a bin
requestsRouter.get('/api/bin/:urlPath', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlPath = req.params.urlPath;
    res.send(yield (0, psql_1.getAllRequestFromBin)(urlPath));
}));
module.exports = requestsRouter;
