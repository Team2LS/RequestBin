import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes, 
  Route, 
  // Link, 
  // useMatch,
  useNavigate
} from 'react-router-dom'
import requestService from '../services/requestService';
import Button from 'react-bootstrap/Button';
import WebhookInfo from '../components/WebhookInfo';
import Request from '../components/Request';


const NoBin = ({ setBinId }) => {
  const navigate = useNavigate();

  const createNewBin = (setBinId) => {
    requestService
      .getNewBin()
      .then(data => {
        setBinId(data)
        navigate(`/${String(data)}`);
      })   
  }

  return (
    <>
      <h1>Requests Hit Hole</h1>
      <div className="float-end"><Button onClick={() => createNewBin(setBinId)}>New Requestbin</Button></div>
      <br></br>
      <p>Create a bin to get started</p>
    </>
  )
}

const SpecifiedBin = ({ webhooks, setWebhooks, requestDetail, setRequestDetail, binId }) => {
  const refreshList = (setWebhooks, binId) => {
    requestService
    .getRequestsByBinId(binId)
    .then(setWebhooks)
  }

  const handleRequestInfoClick = (mongoId: string): void => {
    requestService
      .getPayloadByMongoId(mongoId)
      .then(data => setRequestDetail(JSON.stringify(data, null, 2)))
  };

  return (
    <>
      <h1>Requests Hit Hole</h1>
      <div className="float-end"><Button onClick={() => refreshList(setWebhooks, binId)}>Refresh List</Button></div><br></br>
      <h2>You endpoint is {`${binId}.requestshithole.com`}</h2><br></br>
      <div className="btn-group-vertical float-left">
          {webhooks.map(webhooks =>
            <button key={webhooks["id"]} type="button" className="btn btn-outline-dark" onClick={() => handleRequestInfoClick(webhooks["mongo_id"])}>
              <WebhookInfo request_method={webhooks["http_method"]} http_path={webhooks["http_path"]}/>
            </button>
          )}
      </div>
      <div className="float-end">
        <Request payloadData={requestDetail} />
      </div>


    </>
  )
}

const App = () => {
  const [binId, setBinId] = useState("localhost:3001");
  const [webhooks, setWebhooks] = useState([]);
  const [requestDetail, setRequestDetail] = useState("");

  useEffect(() => {
    requestService
      .getRequestsByBinId(binId)
      .then(setWebhooks)
  }, [binId]);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<NoBin setBinId={setBinId}/>} />
        <Route path='/:binId' element={<SpecifiedBin webhooks={webhooks} setWebhooks={setWebhooks} requestDetail = {requestDetail} setRequestDetail = {setRequestDetail} binId={binId}/>} />
      </Routes>
    </Router>
  )
}

export default App
