import * as express from 'express';
const requestsRouter = express.Router()
import { savePayload, getPayloadById, getAllPayloads } from './services/mongodb'
import { getBinId, saveRequest, createBin } from './services/psql'
import { makeUrlPath } from './helpers';

requestsRouter.get('/', async(req, res) => {
  const requests = await getAllPayloads()

  res.json(requests)
})

requestsRouter.get('/payload/:id', async(req, res) => {
  const id = req.params.id
  const payload = await getPayloadById(id)

  if (payload === null) {
    res.status(400).send()
  } else {
    res.json(payload)
  }
})

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

requestsRouter.post('/api/bin', async(req, res) => {
  const urlPath = makeUrlPath(12)
  try {
    await createBin(urlPath)
  } catch {
    console.log("oh no the bin wasn't made")
  }
  res.send(urlPath)
}) 

module.exports = requestsRouter
