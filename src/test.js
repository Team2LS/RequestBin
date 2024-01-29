const Request = require('./models/request')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/rhh')

async function foo() {
  console.log('woo')
  const request = new Request({payload: {"hi":"hi"}})
  await request.save()
         .then(result => console.log(result._id.toString()))
  console.log('done')
  mongoose.disconnect()
}

foo()
