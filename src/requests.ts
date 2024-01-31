import * as express from 'express';
const requestsRouter = express.Router()
import { savePayload, getPayloadById, getAllPayloads } from './services/mongodb'
import { getBinId, saveRequest, createBin, getAllBins, getAllRequestFromBin } from './services/psql'
import { makeUrlPath } from './helpers';

// get all payloads from mongoDB
requestsRouter.get('/', async(req, res) => {
  const requests = await getAllPayloads()

  res.json(requests)
})

// get a payload from mongoDB
requestsRouter.get('/payload/:id', async(req, res) => {
  const id = req.params.id
  const payload = await getPayloadById(id)

  if (payload === null) {
    res.status(400).send()
  } else {
    res.json(payload)
  }
})

// saves payload to mongoDB and request to postgres
requestsRouter.post('/', async(req, res) => {
  let urlPath

  if (req.headers.host === undefined) {
    res.status(400).send()
    return null
  } else {
    urlPath = req.headers.host.split('.')[0]
  }

  const binId = await getBinId(urlPath)

  if (urlPath.split('.')[0] == undefined) {
    res.status(400).send()
  }

  if (binId) {
    const mongoId = await savePayload(req.body)
    await saveRequest(mongoId, binId, "POST", urlPath)
    console.log("Created new webhook entry", urlPath, binId, mongoId)
    res.status(202).send()
  } else {
    res.status(400).send()
  }
})

// create new bin in postgres
requestsRouter.post('/api/bin', async(req, res) => {
  const urlPath = makeUrlPath(12)
  try {
    await createBin(urlPath)
  } catch {
    console.log("oh no the bin wasn't made")
    res.status(400).send()
  }
  res.send(urlPath)
})

// get all bins from postgres
requestsRouter.get('/api/bins', async(req, res) => {
  res.send(await getAllBins())
})

// get all requests for a bin
requestsRouter.get('/api/bin/:urlPath', async(req, res) => {
  const urlPath = req.params.urlPath

  res.send(await getAllRequestFromBin(urlPath))
})

module.exports = requestsRouter
