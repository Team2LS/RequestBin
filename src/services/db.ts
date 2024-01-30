import * as mongoose from 'mongoose';
import * as pg from 'pg';

const Client = pg.Client;

const requestSchema = new mongoose.Schema({ payloadData: {} });

const Payload = mongoose.model('Request', requestSchema);


mongoose.connect('mongodb://127.0.0.1/rhh')
const db = mongoose.connection


async function savePayload(json: Object) {
  const request = new Payload({"payloadData": json})

  return request.save().then((result) => {
    console.log('request saved!')
    return result._id.toString()
  })
}

async function getBinId(urlPath: string) {
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

async function saveRequest(mongoId: string, binId: number, http_method: string, http_path: string) {
  const client = new Client({
    "database": "rhh",
  })
  await client.connect()

  client.query("INSERT INTO requests (mongo_id, bin_id, http_method, http_path) VALUES ($1, $2, $3, $4)", [mongoId, binId, http_method, http_path])
}

async function getRequestById(id: string) {
  const result = await Payload.findById(new mongoose.Types.ObjectId(id))
  if (result === null) { return }

  return result.payloadData
}

function getAllRequests() {
  return Payload.find({}).then((requests) => {
    return requests
  })
}

export { Payload, saveRequest, getBinId, savePayload, getRequestById, getAllRequests }