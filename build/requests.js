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
const db_1 = require("./services/db");
requestsRouter.get('/', (req, res) => {
    db_1.Payload.find({}).then(requests => {
        res.json(requests);
    });
});
requestsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let urlPath;
    if (req.headers.host === undefined) {
        res.status(400).send();
        return undefined;
    }
    else {
        urlPath = req.headers.host.split('.')[0];
    }
    const binId = yield (0, db_1.getBinId)(urlPath);
    if (urlPath.split('.')[0] == undefined) {
        res.status(400).send();
    }
    if (binId) {
        const mongoId = yield (0, db_1.savePayload)(req.body);
        yield (0, db_1.saveRequest)(mongoId, binId, "POST", urlPath);
        console.log("Created new webhook entry", urlPath, binId, mongoId);
        res.status(202).send();
    }
    else {
        res.status(400).send();
    }
}));
module.exports = requestsRouter;
