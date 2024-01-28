const { Client } = require('pg')
const Request = require('../models/request')

async function saveRequest(mongo_id) {
  const client = new Client({
    "database": "rhh",
  })
  await client.connect()
  await client.query("INSERT INTO requests (bin_id, mongo_id, http_method, http_path) VALUES (3, $1, 'POST', 'localhost')", [mongo_id])
  await client.end()
}

module.exports = { saveRequest }