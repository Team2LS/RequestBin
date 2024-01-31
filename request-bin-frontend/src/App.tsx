import { useState, useEffect } from 'react';
import requestService from '../services/requestService';
import Button from 'react-bootstrap/Button';
import WebhookInfo from '../components/WebhookInfo';
import Request from '../components/Request';

const App = () => {
  const [binId, setBinId] = useState("localhost:3001");
  const [webhooks, setWebhooks] = useState([]);
  const [requestDetail, setRequestDetail] = useState("");
  // const [newRequest, setNewRequest] = useState({});

  useEffect(() => {
    requestService
      .getRequestsByBinId(binId)
      .then(setWebhooks)
  }, []);

  const handleRequestInfoClick = (mongoId: string): void => {
    requestService
      .getPayloadByMongoId(mongoId)
      .then(data => setRequestDetail(JSON.stringify(data, null, 2)))
  };

  return (
    <>
      <h1>Requests Hit Hole</h1>
      <div className="float-end"><Button>New Requestbin</Button></div><br></br>
      <h2><u>My Webhooks</u></h2>

      <div className="btn-group-vertical float-left">
          {webhooks.map(webhooks =>
            <button type="button" className="btn btn-outline-dark" onClick={() => handleRequestInfoClick(webhooks["mongo_id"])}>
              <WebhookInfo key={webhooks["id"]} request_method={webhooks["http_method"]} http_path={webhooks["http_path"]}/>
            </button>
          )}
      </div>
      <div className="float-end">
        <Request payloadData={requestDetail} />
      </div>
    </>
  );
}

export default App
