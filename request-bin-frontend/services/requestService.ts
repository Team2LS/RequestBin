const baseUrl = 'http://localhost:3001';

const getRequestsByBinId = (binId: string) => {
  return fetch(baseUrl + "/api/bin/" + binId)
    .then(response => response.ok ? response.json() : response.text())
    .then(data => data)
    .catch(error => console.error(error));
};

const getPayloadByMongoId = (mongoId: string) => {
  return fetch(`${baseUrl}/api/payload/${mongoId}`)
    .then(response => response.ok ? response.json() : response.text())
    .then(data => data)
    .catch(error => console.error(error));
}

export default { getRequestsByBinId, getPayloadByMongoId };