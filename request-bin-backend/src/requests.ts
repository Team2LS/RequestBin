import * as express from 'express';
const requestsRouter = express.Router()
import { savePayload, getPayloadById, getAllPayloads } from './services/mongodb'
import { getBinId, saveRequest, createBin, getAllBins, getAllRequestFromBin } from './services/psql'
import { makeUrlPath } from './helpers';

const BIN_URL_PATH_LENGTH = 12

// get a payload from mongoDB
requestsRouter.get('/api/payload/:id', async(req, res) => {
  const id = req.params.id
  let payload = null

  try {
    payload = await getPayloadById(id)

    if (payload === null) {
      throw new Error(`Error: Unable to retrieve payload with ID '${id}'`)
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    }
  }

  res.json(payload)
})

// saves payload to mongoDB and request to postgres
requestsRouter.post('/', async(req, res) => {
  try {
    if (!req || !req.headers || !req.headers.host) {
      throw new Error(`Invalid or missing host name`)
    }

    const urlPath = req.headers.host.split('.')[0]
    const binId = await getBinId(urlPath)
    const req_method = req.method ? req.method : ""

    if (!binId) {
      throw new Error(`Invalid bin URL path ${urlPath}`)
    }

    const mongoId = await savePayload(req)
    await saveRequest(mongoId, binId, req_method, urlPath)

    console.log(`Created new webhook entry: [URL path]:${urlPath} [Bin ID]:${binId} [Mongo ID]:${mongoId}`)
    res.status(202).send({ success: true })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    }
  }
})

// create new bin in postgres
requestsRouter.post('/api/bin', async(req, res) => {
  let urlPath = makeUrlPath(BIN_URL_PATH_LENGTH)

  try {
    const allBins = await getAllBins();
    const allBinPaths = allBins.flatMap(({url_path}) => url_path);

    while (allBinPaths.includes(urlPath)) {
      urlPath = makeUrlPath(BIN_URL_PATH_LENGTH);
    }

    await createBin(urlPath)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    }
  }

  res.send(urlPath)
})

// get all bins from postgres
requestsRouter.get('/api/bins', async(req, res) => {
  try {
    const allBins = await getAllBins()

    res.status(200).send(allBins)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    }
  }
})

// get all requests for a bin
requestsRouter.get('/api/bin/:urlPath', async(req, res) => {
  const urlPath = req.params.urlPath

  res.send(await getAllRequestFromBin(urlPath))
})

module.exports = requestsRouter
