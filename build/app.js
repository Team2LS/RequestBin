"use strict";
const express = require('express');
const app = express();
const PORT = 3001;
const requestsRouter = require('./requests');
// const mongoose = require('mongoose')
app.use(express.json());
app.use('/', requestsRouter);
app.listen(PORT);
console.log(`listening on port ${PORT}`);
