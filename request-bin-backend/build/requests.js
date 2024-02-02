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
// get all payloads from mongoDB
// TODO Delete, used for testing purposes
requestsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const requests = await getAllPayloads()
    console.log(req);
    res.json(req);
}));
// get a payload from mongoDB
requestsRouter.get('/api/payload/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = yield (0, mongodb_1.getPayloadById)(id);
    if (payload === null) {
        res.status(400).send();
    }
    else {
        res.json(payload);
    }
}));
// saves payload to mongoDB and request to postgres
requestsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('received an endpoint', req);
    let urlPath;
    if (req.headers.host === undefined) {
        console.log('host header is undefined');
        res.status(400).send();
        return null;
    }
    else {
        console.log('setting url path');
        urlPath = req.headers.host.split('.')[0];
    }
    console.log('(AFTER IF BRANCH) The url path is:', urlPath);
    const binId = yield (0, psql_1.getBinId)(urlPath);
    console.log('The bin id is: ', binId);
    // if (urlPath.split('.')[0] == undefined) {
    //   res.status(400).send()
    // }
    if (binId) {
        const mongoId = yield (0, mongodb_1.savePayload)(req);
        console.log('The mongoID is', mongoId);
        yield (0, psql_1.saveRequest)(mongoId, binId, "POST", urlPath);
        console.log("Created new webhook entry", urlPath, binId, mongoId);
        res.status(202).send();
    }
    else {
        console.log('DENIED');
        res.status(400).send();
    }
}));
// create new bin in postgres
requestsRouter.post('/api/bin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlPath = (0, helpers_1.makeUrlPath)(12);
    try {
        yield (0, psql_1.createBin)(urlPath);
    }
    catch (_a) {
        console.log("oh no the bin wasn't made");
        res.status(400).send();
    }
    res.send(urlPath);
}));
// get all bins from postgres
requestsRouter.get('/api/bins', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield (0, psql_1.getAllBins)());
}));
// get all requests for a bin
requestsRouter.get('/api/bin/:urlPath', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const urlPath = req.params.urlPath;
    res.send(yield (0, psql_1.getAllRequestFromBin)(urlPath));
}));
module.exports = requestsRouter;
