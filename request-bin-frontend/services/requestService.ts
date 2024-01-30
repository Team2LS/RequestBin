const baseUrl = 'http://localhost:3001';

const getAll = () => {
  return fetch(baseUrl)
    .then(response => response.ok ? response.json() : response.text())
    .then(data => data)
    .catch(error => console.error(error));
};

export default { getAll };