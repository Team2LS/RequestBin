import * as pg from 'pg';

const Client = pg.Client;

const CONNECTION = { 
  database: "rhh"
};

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
  const client = new Client(CONNECTION)
  await client.connect()

  client.query("INSERT INTO requests (mongo_id, bin_id, http_method, http_path) VALUES ($1, $2, $3, $4);", [mongoId, binId, http_method, http_path])
}

async function createBin(urlPath: string) {
  const client = new Client(CONNECTION)
  await client.connect()
  await client.query("INSERT INTO bins (url_path) VALUES ($1);", [urlPath])
}

async function getAllBins() {
  const client = new Client(CONNECTION)

  await client.connect()
  return (await client.query("SELECT * FROM bins;")).rows
}

async function getAllRequestFromBin(urlPath: string) {
  const client = new Client(CONNECTION)

  await client.connect();

  return (await client.query("SELECT * FROM bins JOIN requests ON bins.id = requests.bin_id WHERE bins.url_path = $1;", [urlPath])).rows}

export { getBinId, saveRequest, createBin, getAllBins, getAllRequestFromBin }