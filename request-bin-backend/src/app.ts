const express = require('express')
const app = express()
const PORT = 3001
const requestsRouter = require('./requests')
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use('/', requestsRouter)

app.listen(PORT)
console.log(`listening on port ${PORT}`)
