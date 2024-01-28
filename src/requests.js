const requestsRouter = require('express').Router()
const { saveRequest } = require('./services/db')

requestsRouter.post('/', async(req, res) => {
  saveRequest(req.body)
  res.status(201).send()
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