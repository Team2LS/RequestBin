import * as mongoose from 'mongoose';

const payloadSchema = new mongoose.Schema({ payloadData: {} });
const Payload = mongoose.model('Payload', payloadSchema);

mongoose.connect('mongodb://127.0.0.1:27017/rhh')

async function savePayload(json: Object) {
  const payload = new Payload({"payloadData": json})

  return payload.save().then((result) => {
    console.log('payload saved!')
    return result._id.toString()
  })
}

async function getPayloadById(id: string) {
  const result = await Payload.findById(id)
  if (result === null) { return null }

  return result.payloadData
}

async function getAllPayloads() {
  const requests = await Payload.find({})
  console.log(requests.length)
  return requests
}

export { savePayload, getPayloadById, getAllPayloads }
