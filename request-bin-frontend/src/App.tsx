import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes, 
  Route,
  useNavigate,
  useParams,
} from 'react-router-dom'
import requestService from '../services/requestService';
import { Button, Stack, Container } from 'react-bootstrap';
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

const SpecifiedBin = ({ webhooks, setWebhooks, requestDetail, setRequestDetail, setBinId, binId}) => {
  const newBinId = useParams().binId;

  useEffect(() => {
    setBinId(newBinId);

    if (newBinId) {
      requestService
        .getRequestsByBinId(newBinId)
        .then(setWebhooks)
    }
  }, []);

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
      <h2>You endpoint is {`${newBinId}.requestshithole.com`}</h2><br></br>
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

const Header = () => {
  return (
    <Stack direction='horizontal' style={{background: 'blue', color: 'white'}}>
      <p>Requests Hit Hole</p>
    </Stack>
  )
}

const BinNav = () => {
  return (
    <Stack direction='horizontal' style={{background: 'green'}}>
      <h2>Your endpoint is ASDFASDFASDF</h2>
      <h4 className='ms-auto'>Refresh</h4>
    </Stack>
  )
}

const Requests = () => {
  return (
    <Stack gap={0} direction='horizontal' style={{background: 'yellow'}}>
      <RequestNav />
      <RequestViewer style={{background: 'purple'}}/>
    </Stack>
  )
}

const RequestNav = () => {
  return (
    <ul>
      <li>Request 1</li>
      <li>Request 2</li>
      <li>Request 3</li>
    </ul>
  )
}

const RequestViewer = () => {
  return (
    <p>All the data</p>
  )
}

const Main = () => {
  return (
    // <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0}>
      <Stack style={{padding: 0, height: '100%', background: 'purple'}}>
        <Header />
        <BinNav />
        <Requests />
      </Stack>
    // </div>
  )
}

const App = () => {
  const [binId, setBinId] = useState("");
  const [webhooks, setWebhooks] = useState([]);
  const [requestDetail, setRequestDetail] = useState("");
  
  return (
    <div style={{padding: 0, height: '100vh', width: '100vw', position: 'fixed'}}>
      <Main />
    </div>
  )
}

export default App
