const requestsRouter = require('express').Router()
const { saveRequest, getBinId, savePayload, getRequest } = require('./services/db')

requestsRouter.get('/', (req, res) => {
  getRequest()
  res.status(200).send()
})

requestsRouter.post('/', async(req, res) => {
  const urlPath = req.headers.host.split('.')[0]

  const binId = await getBinId(urlPath)

  if (binId) {
    const mongoId = await savePayload(req.body, binId)
    // await saveRequest(mongoId, binId, "POST", urlPath)
    console.log("Created new webhook entry", urlPath, binId, mongoId)
    res.status(202).send()
  } else {
    res.status(400).send()
  }
})

module.exports = requestsRouter

/*
High Level process:

When a route receives a POST request containing a JSON payload

Algorithm:
  Determine what bin it should go into TODO hardcode for now
  get the primary key from the SQL database for that bin TODO hardcode for now
  create a new mongodb database entry, and save it's ID
  create a new sql entry for the request, containing all required info


*/