import * as mongoose from 'mongoose';

const payloadSchema = new mongoose.Schema({ payloadData: {}, headers: {} });
const Payload = mongoose.model('Payload', payloadSchema);

mongoose.connect('mongodb://127.0.0.1:27017/rhh?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.3')
const db = mongoose.connection

async function savePayload(req: any) {
  const payload = new Payload({"payloadData": req.body, "headers": req.headers})

  return payload.save().then((result) => {
    console.log('payload saved!')
    return result._id.toString()
  })
}

async function getPayloadById(id: string) {
  const result = await Payload.findById(id)
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