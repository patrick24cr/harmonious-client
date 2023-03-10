import axios from 'axios';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const createReport = (payload) => new Promise((resolve, reject) => {
  console.warn(payload);
  axios.post(`${dbUrl}/badQuestionReports`, payload)
    .then((response) => resolve(response))
    .catch((error) => reject(error));
});

export default createReport;
