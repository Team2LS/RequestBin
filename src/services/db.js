const { Client } = require('pg')
const mongoose = require('mongoose')

const requestSchema = new mongoose.Schema({ payloadData: mongoose.Mixed });

const Request = mongoose.model('Request', requestSchema);


mongoose.connect('mongodb://127.0.0.1/rhh')
const db = mongoose.connection


async function savePayload(json) {
  const request = new Request({"payloadData": json})

  request.save().then(() =>
    console.log('request saved!')
  )
}

async function getBinId(urlPath) {
  const client = new Client({
    "database": "rhh",
  })
  await client.connect()

  const result = await client.query("SELECT * FROM bins WHERE url_path = $1", [urlPath])

  await client.end()

  if (result.rowCount != 1) {
    return undefined
  } else {
    return result.rows[0].id
  }

}

async function saveRequest(mongoId, binId, http_method, http_path) {
  const client = new Client({
    "database": "rhh",
  })
  await client.connect()

  client.query("INSERT INTO requests (mongo_id, bin_id, http_method, http_path) VALUES ($1, $2, $3, $4)", [mongoId, binId, http_method, http_path])
}

async function getRequestById(id) {
  const result = await Request.findById(new mongoose.Types.ObjectId(id))
  return result.payloadData
}

function getAllRequests() {
  return Request.find({}).then(requests => {
    return requests
  })
}

module.exports = { Request, saveRequest, getBinId, savePayload, getRequestById, getAllRequests }