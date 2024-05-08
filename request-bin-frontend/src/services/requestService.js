const baseUrl = "http://localhost:3001";
const getRequestsByBinId = (binId) => {
  return fetch(baseUrl + "/api/bin/" + binId)
    .then((response) => (response.ok ? response.json() : response.text()))
    .then((data) => data)
    .catch((error) => console.error(error));
};
const getNewBin = () => {
  return fetch(baseUrl + "/api/bin/", { method: "POST" })
    .then((response) => (response.ok ? response.text() : "nil"))
    .catch((error) => console.error(error));
};
const getPayloadByMongoId = (mongoId) => {
  return fetch(`${baseUrl}/api/payload/${mongoId}`)
    .then((response) => (response.ok ? response.json() : response.text()))
    .then((data) => data)
    .catch((error) => console.error(error));
};
export default { getRequestsByBinId, getNewBin, getPayloadByMongoId };
