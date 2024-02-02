"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const requestsRouter = require('./requests');
const cors = require('cors');
const morgan = require('morgan');
app.use(express_1.default.json());
app.use(cors());
app.use('/', requestsRouter);
app.use(morgan("common"));
app.use((_req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Serving running on port ${PORT}`);
});
