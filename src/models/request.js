const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({
  payload: JSON,
})

module.exports = mongoose.model('Request', requestSchema)