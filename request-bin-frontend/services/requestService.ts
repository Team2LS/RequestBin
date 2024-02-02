import { useNavigate } from 'react-router-dom'
import localBins from './sessionPersistence'

const baseUrl = 'https://requestshithole.com';

const getRequestsByBinId = (binId: string) => {
  return fetch(baseUrl + "/api/bin/" + binId)
    .then(response => response.ok ? response.json() : response.text())
    .then(data => data)
    .catch(error => console.error(error));
};

const getNewBin = () => {
  return fetch(baseUrl + "/api/bin/", {method: "POST"})
    .then(response => response.ok ? response.text() : "nil")
    .catch(error => console.error(error));
};

const getPayloadByMongoId = (mongoId: string) => {
  return fetch(`${baseUrl}/api/payload/${mongoId}`)
    .then(response => response.ok ? response.json() : response.text())
    .then(data => data)
    .catch(error => console.error(error));
}

const createNewBin = () => {
  const navigate = useNavigate();

  getNewBin().then(data => {
    localBins.saveBinId(data);
    navigate(`/${String(data)}`);
  })
}

export default { getRequestsByBinId, getNewBin, getPayloadByMongoId, createNewBin };
