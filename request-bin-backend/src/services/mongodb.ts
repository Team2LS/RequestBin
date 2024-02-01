import * as mongoose from 'mongoose';

const payloadSchema = new mongoose.Schema({ payloadData: {}, headers: {} });
const Payload = mongoose.model('Payload', payloadSchema);

mongoose.connect('mongodb://127.0.0.1/rhh')
const db = mongoose.connection

async function savePayload(req: any) {
  console.log(req.headers);
  const payload = new Payload({"payloadData": req.body, "headers": req.headers})

  return payload.save().then((result) => {
    console.log('payload saved!')
    return result._id.toString()
  })
}

async function getPayloadById(id: string) {
  const result = await Payload.findById(id)
  console.log(result)
  if (result === null) { return null }

  return {
    headers: result.headers,
    payload: result.payloadData
  }
}

async function getAllPayloads() {
  const requests = await Payload.find({})
  return requests
}

export { savePayload, getPayloadById, getAllPayloads }