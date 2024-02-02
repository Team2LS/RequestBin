import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from 'react-router-dom'
import requestService from '../services/requestService';
import { Button, Stack, ButtonGroup, Dropdown } from 'react-bootstrap';
import WebhookInfo from '../components/WebhookInfo';
import Request from '../components/Request';
import localBins from '../services/sessionPersistence'

type JSONPrimitive = string | number | boolean | JSONObject | null | undefined;
type JSONObject = { [key: string]: JSONPrimitive } | JSONObject[];

const NoBin = () => {
  const navigate = useNavigate();

  const createNewBin = () => {
    requestService
      .getNewBin()
      .then(data => {
        localBins.saveBinId(data);
        navigate(`/${String(data)}`);
      })
  }

  return (
    <>
      <div className="float-end"><Button onClick={createNewBin}>New Hole</Button></div>
      <br></br>
      <p>Create a bin to get started</p>
    </>
  )
}

const SpecifiedBin = ({ webhooks, setWebhooks, requestDetail, setRequestDetail, allBins}) => {
  const currentBinId = useParams().binId;
  const [reqInfo, setReqInfo] = useState(null);

  useEffect(() => {
    if (currentBinId) {
      requestService
        .getRequestsByBinId(currentBinId)
        .then(setWebhooks)
    }
  }, []);

  const refreshList = (setWebhooks, currentBinId) => {
    requestService
      .getRequestsByBinId(currentBinId)
      .then(setWebhooks)
  }

  const handleRequestInfoClick = (webhook): void => {
    requestService
      .getPayloadByMongoId(webhook["mongo_id"])
      .then(setRequestDetail)
      .then(() => setReqInfo(webhook))
  };

  return (
    <>
      <BinNav binId={currentBinId} setWebhooks={setWebhooks} refreshList={refreshList} allBins={allBins} />
      <Stack className="overflow-auto" direction='horizontal'>
        <RequestNav webhooks={webhooks} handleRequestInfoClick={handleRequestInfoClick}/>
        <Request reqInfo={reqInfo} reqPayload={requestDetail}/>
      </Stack>
    </>
  )
}

const RequestNav = ({ webhooks, handleRequestInfoClick }) => {
  return (
    <div className="btn-group-vertical float-left">
      <ButtonGroup vertical>
        {webhooks.map(webhook =>
          <Button key={webhook['id']} type="button" className="btn btn-outline-dark" onClick={() => handleRequestInfoClick(webhook)}>
            <WebhookInfo request_method={webhook["http_method"]} http_path={webhook["http_path"]}/>
          </Button>
        )}
      </ButtonGroup>
    </div>
  )
}

const Header = () => {
  return (
    <Stack direction='horizontal' style={{background: 'black', color: 'white', padding: 5}}>
      <p>Requests Hit Hole</p>
    </Stack>
  )
}

const BinNav = ({ binId, refreshList, setWebhooks, allBins }) => {
  return (
    <Stack direction='horizontal' style={{background: 'green'}}>
      <Dropdown>
        <Dropdown.Toggle variant='success' id='dropdown-basic'>
          Hit Holes
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {allBins.map(bin => {
            return <Dropdown.Item href={`/${bin}`} key={bin}>{bin}</Dropdown.Item>
          })}
        </Dropdown.Menu>
      </Dropdown>
      <h2>Your endpoint is {`${binId}.requestshithole.com`}</h2>
      <Button className='ms-auto' onClick={() => refreshList(setWebhooks, binId)}>Refresh List</Button>
    </Stack>
  )
}

const App = () => {
  const [allBins, setAllBins] = useState(localBins.getSavedBinIds());
  const [webhooks, setWebhooks] = useState([]);
  const [requestDetail, setRequestDetail] = useState("");

  return (
    <div style={{padding: 0, height: '100vh', width: '100vw', position: 'fixed'}}>
      <Stack style={{padding: 0, height: '100%'}}>
        <Header />
        <Router>
          <Routes>
            {/* { (allBins.length > 0) && // TODO, this is a route for the baseURL but while there are local bins saved
              <Route path='/' element={<SpecifiedBin webhooks={webhooks} setWebhooks={setWebhooks} requestDetail = {requestDetail} setRequestDetail = {setRequestDetail} setBinId={setBinId} binId={binId}/>} />
            } */}
            <Route path='/' element={<NoBin />} />
            <Route path='/:binId' element={<SpecifiedBin webhooks={webhooks} setWebhooks={setWebhooks} requestDetail={requestDetail} setRequestDetail={setRequestDetail} allBins={allBins}/>} />
          </Routes>
        </Router>
      </Stack>
    </div>
  )
}

export default App;
