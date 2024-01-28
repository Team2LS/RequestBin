const express = require('express')
const app = express()
const PORT = 3001


app.use(express.json())

app.get('/', async(req, res) => {
  const client = new Client({
    "database": "rhh",
  })
  await client.connect()
  console.log(req)
  // const result = await client.query('SELECT * FROM bins;')
  await client.end()
  res.status(200).send()
})

app.post('/', async(req, res) => {
})

app.listen(PORT)
console.log(`listening on port ${PORT}`)
