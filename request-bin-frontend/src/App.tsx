import { useState, useEffect } from 'react';
import requestService from '../services/requestService';
import Button from 'react-bootstrap/Button';
// import Request from '../components/Request';

const App = () => {
  const [requests, setRequests] = useState([]);
  // const [newRequest, setNewRequest] = useState({});

  useEffect(() => {
    requestService
      .getAll()
      .then(setRequests)
  }, []);

  return (
    <>
      <h1>Requests Hit Hole</h1>
      <div className="float-end"><Button>New Requestbin</Button></div><br></br>
      <h2>My Requests</h2>
      <ol>
        {requests.map(request =>
          <li>{JSON.stringify(request, null, 2)}</li>
        )}
      </ol>
    </>
  )
}

export default App
