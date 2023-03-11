import axios from 'axios';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getSoundscapes = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/soundscapes?uid=${uid}`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});

const createSoundscape = (payload) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/soundscapes`, payload)
    .then(resolve)
    .catch(reject);
});

const updateSoundscape = (pk, payload) => new Promise((resolve, reject) => {
  axios.put(`${dbUrl}/soundscapes/${pk}`, payload)
    .then(resolve)
    .catch(reject);
});

const deleteSoundscape = (pk) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/soundscapes/${pk}`)
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
});

const getChordProgressions = (pk) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/soundscapeChordProgressions?pk=${pk}`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});

const deleteSingleBand = (firebaseKey) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/bands/${firebaseKey}.json`)
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
});

const createBand = (bandObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/bands.json`, bandObj)
    .then((response) => {
      const payload = { firebaseKey: response.data.name };
      axios.patch(`${dbUrl}/bands/${response.data.name}.json`, payload)
        .then(resolve);
    }).catch(reject);
});

const updateBand = (bandObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/bands/${bandObj.firebaseKey}.json`, bandObj)
    .then(resolve)
    .catch(reject);
});

const getSingleBand = (firebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/bands/${firebaseKey}.json`)
    .then((response) => resolve(response.data))
    .catch(reject);
});

const getBandMembers = (bandFirebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/members.json?orderBy="band"&equalTo="${bandFirebaseKey}"`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});

const viewBandDetails = (bandFirebaseKey) => new Promise((resolve, reject) => {
  Promise.all([getSingleBand(bandFirebaseKey), getBandMembers(bandFirebaseKey)])
    .then(([bandObject, bandMembersArray]) => {
      resolve({ ...bandObject, members: bandMembersArray });
    }).catch((error) => reject(error));
});

const deleteSingleMember = (firebaseKey) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/members/${firebaseKey}.json`)
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
});

const createMember = (memberObj) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/members.json`, memberObj)
    .then((response) => {
      const payload = { firebaseKey: response.data.name };
      axios.patch(`${dbUrl}/members/${response.data.name}.json`, payload)
        .then(resolve);
    }).catch(reject);
});

const updateMember = (memberObj) => new Promise((resolve, reject) => {
  axios.patch(`${dbUrl}/members/${memberObj.firebaseKey}.json`, memberObj)
    .then(resolve)
    .catch(reject);
});

const getSingleMember = (firebaseKey) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/members/${firebaseKey}.json`)
    .then((response) => resolve(response.data))
    .catch(reject);
});

const deleteBandAndMembers = (bandFirebaseKey) => new Promise((resolve, reject) => {
  getBandMembers(bandFirebaseKey).then((membersArray) => {
    const deleteBookPromises = membersArray.map((member) => deleteSingleMember(member.firebaseKey));

    Promise.all(deleteBookPromises).then(() => {
      deleteSingleBand(bandFirebaseKey).then(resolve);
    });
  }).catch((error) => reject(error));
});

export {
  getSoundscapes,
  createSoundscape,
  updateSoundscape,
  deleteSoundscape,
  getChordProgressions,
  deleteSingleBand,
  getSingleBand,
  viewBandDetails,
  createBand,
  updateBand,
  deleteSingleMember,
  createMember,
  updateMember,
  getSingleMember,
  deleteBandAndMembers,
};
