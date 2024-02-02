const express = require('express')
const app = express()
const PORT = 3001
const requestsRouter = require('./requests')
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use('/', requestsRouter)
app.use(morgan("common"))

app.listen(PORT)
console.log(`listening on port ${PORT}`)
