import axios from 'axios';
import { clientCredentials } from '../utils/client';
import { getSoundscapes, deleteSoundscape, deleteAllChordProgressions } from './soundscapes';

const dbUrl = clientCredentials.databaseURL;

const getUser = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/users?uid=${uid}`)
    .then((response) => resolve(response.data[0]))
    .catch((error) => reject(error));
});

const deleteUser = (uid) => new Promise((resolve, reject) => {
  getUser(uid).then((response) => {
    axios.delete(`${dbUrl}/users/${response.id}`)
      .then((response2) => resolve(response2))
      .catch((error) => reject(error));
  });
});

const deleteUserAndData = (uid) => new Promise((resolve, reject) => {
  getSoundscapes(uid).then((response) => {
    console.warn(response);
    const soundscapePks = response.map((element) => (element.id));
    console.warn(soundscapePks);
    const deleteAllChordProgressionsPromises = soundscapePks.map((pk) => deleteAllChordProgressions(pk));
    const deleteSoundscapePromises = soundscapePks.map((pk1) => deleteSoundscape(pk1));
    console.warn('started first batch');
    Promise.all(deleteAllChordProgressionsPromises)
      .then(() => {
        console.warn('finished first batch');
        Promise.all(deleteSoundscapePromises)
          .then(() => {
            console.warn('finished second batch');
            deleteUser(uid);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
});

export {
  getUser,
  deleteUser,
  deleteUserAndData,
};
