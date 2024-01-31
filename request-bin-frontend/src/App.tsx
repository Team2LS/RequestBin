import { useState, useEffect } from 'react';
import requestService from '../services/requestService';
import Button from 'react-bootstrap/Button';
import WebhookInfo from '../components/WebhookInfo';

const App = () => {
  const [binId, setBinId] = useState("localhost:3001");
  const [webhooks, setWebhooks] = useState([]);
  // const [newRequest, setNewRequest] = useState({});

  useEffect(() => {
    requestService
      .getRequestsByBinId(binId)
      .then(setWebhooks)
  }, []);

  console.log(webhooks);
  return (
    <>
      <h1>Requests Hit Hole</h1>
      <div className="float-end"><Button>New Requestbin</Button></div><br></br>
      <h2>My Webhooks</h2>
      <ol>
        {webhooks.map(webhooks =>
          <WebhookInfo key={webhooks["id"]} request_method={webhooks["http_method"]} http_path={webhooks["http_path"]}/>
          // <li>{JSON.stringify(request, null, 2)}</li>
        )}
      </ol>
    </>
  )
}

export default App
