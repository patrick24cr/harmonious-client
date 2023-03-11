import axios from 'axios';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getSoundscapes = (uid) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/soundscapes?uid=${uid}`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});

const deleteSoundscape = (pk) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/soundscapes/${pk}`)
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
});

const getChordProgressions = (soundscapePk) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/soundscapeChordProgressions?pk=${soundscapePk}`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});

const deleteChordProgression = (pk) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/soundscapeChordProgressions/${pk}`)
    .then((response) => resolve(response.data))
    .catch((error) => reject(error));
});

const deleteAllChordProgressions = (soundscapePk) => new Promise((resolve, reject) => {
  getChordProgressions(soundscapePk).then((response) => {
    console.warn('started deleting the progressions of soundscape:', soundscapePk);
    const originalProgressionsPks = response.map((element) => element.id);
    const removeAllProgressions = originalProgressionsPks.map((progressionPk) => deleteChordProgression(progressionPk));
    Promise.all(removeAllProgressions)
      .then((secondResponse) => resolve(secondResponse.data))
      .catch((error) => reject(error));
  });
});

const createChordProgression = (soundscape, progression) => new Promise((resolve, reject) => {
  const payload = {
    soundscape,
    chordProgression: progression,
  };
  axios.post(`${dbUrl}/soundscapeChordProgressions`, payload)
    .then(resolve)
    .catch(reject);
});

const createChordProgressions = (soundscapePk, progressionString) => new Promise((resolve, reject) => {
  // progressionString.map
  // define the payload
  const progressionStringArray = progressionString.split('');
  const progressionPromises = progressionStringArray.map((character) => createChordProgression(soundscapePk, character));
  Promise.all(progressionPromises)
    .then((secondResponse) => resolve(secondResponse.data))
    .catch((error) => reject(error));
});

const updateChordProgressions = (soundscapePk, progressionString) => {
  deleteAllChordProgressions(soundscapePk).then(() => {
    createChordProgressions(soundscapePk, progressionString);
  });
};

const updateSoundscape = (pk, payload, progressionString) => new Promise((resolve, reject) => {
  axios.put(`${dbUrl}/soundscapes/${pk}`, payload)
    .then(() => {
      updateChordProgressions(pk, progressionString);
      resolve(); // may not be chained right to catch the above line's errors
    })
    .catch(reject);
});

const createSoundscape = (payload, progressionString) => new Promise((resolve, reject) => {
  axios.post(`${dbUrl}/soundscapes`, payload)
    .then((response) => {
      updateChordProgressions(response.data.id, progressionString);
      resolve(); // may not be chained right to catch the above line's errors
    })
    .catch(reject);
});

const getChordProgressionsDetailed = (soundscapePk) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/soundscapeChordProgressions?pk=${soundscapePk}&detail=true`)
    .then((response) => resolve(Object.values(response.data)))
    .catch((error) => reject(error));
});

export {
  getSoundscapes,
  createSoundscape,
  updateSoundscape,
  deleteSoundscape,
  getChordProgressions,
  deleteChordProgression,
  deleteAllChordProgressions,
  createChordProgression,
  createChordProgressions,
  updateChordProgressions,
  getChordProgressionsDetailed,
};
