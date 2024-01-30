const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3001
const requestsRouter = require('./requests')
// const mongoose = require('mongoose')

app.use(express.json())
app.use(cors())

app.use('/', requestsRouter)

app.listen(PORT)
console.log(`listening on port ${PORT}`)
