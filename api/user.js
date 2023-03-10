import axios from 'axios';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const deleteUser = (id) => new Promise((resolve, reject) => {
  axios.delete(`${dbUrl}/users/${id}`)
    .then((response) => resolve(response))
    .catch((error) => reject(error));
});

export default deleteUser;
