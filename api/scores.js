import axios from 'axios';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const createScore = (payload) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/scores.json`, payload)
    .then((response) => {
      const keyPayload = { firebaseKey: response.data.name };
      axios.patch(`${dbUrl}/scores/${response.data.name}.json`, keyPayload)
        .then((secondResponse) => resolve(secondResponse));
    })
    .catch((error) => reject(error));
});

const updateScoreByFirebaseKey = (firebaseKey, payload) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/scores/${firebaseKey}.json`, payload)
    .then((response) => resolve(response))
    .catch((error) => reject(error));
});

const updateScoreByPrimaryKey = (primaryKey, payload) => new Promise((resolve, reject) => {
  axios.put(`${dbUrl}/userTileScores/${primaryKey}`, payload)
    .then((response) => resolve(response))
    .catch((error) => reject(error));
});

const getScoreByTileAndUser = (tile, userId) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/userTileScores?user=${userId}&tile=${tile}`)
    .then((response) => resolve(response.data[0]))
    .catch((error) => reject(error));
});

const getScoresById = (id) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/userTileScores?user=${id}`)
    .then((response) => {
      const tempScores = {};
      Object.values(response.data).forEach((element) => {
        tempScores[element.tile.name.toLowerCase()] = element.score;
      });
      resolve(tempScores);
    })
    .catch((error) => reject(error));
});

const getScoresByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/scores.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      const tempScores = {};
      Object.values(response.data).forEach((element) => {
        tempScores[element.tile] = element.score;
      });
      resolve(tempScores);
    })
    .catch((error) => reject(error));
});

const getScoreFirebaseKeysByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/scores.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      const tempScores = {};
      Object.values(response.data).forEach((element) => {
        tempScores[element.tile] = element.firebaseKey;
      });
      resolve(tempScores);
    })
    .catch((error) => reject(error));
});

const deleteScoreByFirebaseKey = (firebaseKey) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/scores/${firebaseKey}.json`)
    .then((response) => resolve(response))
    .catch((error) => reject(error));
});

const deleteAllScoresByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/scores.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      const firebaseKeys = [];
      Object.values(response.data).forEach((element) => {
        firebaseKeys.push(element.firebaseKey);
      });
      const deleteScorePromises = firebaseKeys.map((firebaseKey) => deleteScoreByFirebaseKey(firebaseKey));
      Promise.all(deleteScorePromises).then(resolve);
    })
    .catch((error) => reject(error));
});

const deleteAllScoresById = (id) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/userTileScores/${id}`)
    .then((response) => resolve(response))
    .catch((error) => reject(error));
});

export {
  createScore,
  updateScoreByFirebaseKey,
  updateScoreByPrimaryKey,
  getScoreByTileAndUser,
  getScoresById,
  getScoresByUid,
  getScoreFirebaseKeysByUid,
  deleteScoreByFirebaseKey,
  deleteAllScoresByUid,
  deleteAllScoresById,
};
