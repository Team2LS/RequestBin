const { Client } = require('pg')
// const Request = require('../models/request')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/rhh')
const db = mongoose.connection

async function saveRequest(req) {
  // Connect to psql
  const client = new Client({
    "database": "rhh",
  })
  await client.connect()

  // Create a mongodb entry
  let mongo_id
  await db.collection('requests').insertOne(req)
    .then(result => {
      mongo_id = result.insertedId.toString()
    })

  // Create a psql request entry
  await client.query("INSERT INTO requests (bin_id, mongo_id, http_method, http_path) VALUES (1, $1, 'POST', 'localhost')", [mongo_id])
  await client.end()
}

module.exports = { saveRequest }