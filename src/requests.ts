const requestsRouter = require('express').Router()
const { Request, saveRequest, getBinId, savePayload, getRequestById, getAllRequests } = require('./services/db')

requestsRouter.get('/', (req, res) => {
  Request.find({}).then(requests => {
    res.json(requests)
  })
})

requestsRouter.post('/', async(req, res) => {
  const urlPath = req.headers.host.split('.')[0]

  const binId = await getBinId(urlPath)

  if (binId) {
    const mongoId = await savePayload(req.body)
    // await saveRequest(mongoId, binId, "POST", urlPath)
    console.log("Created new webhook entry", urlPath, binId, mongoId)
    res.status(202).send()
  } else {
    res.status(400).send()
  }
})

module.exports = requestsRouter
