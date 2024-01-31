"use strict";
const mongoose = require('mongoose');
const payloadSchema = new mongoose.Schema({ payloadData: Buffer });
const Payload = mongoose.model('payload', payloadSchema);
module.exports = { Payload };
