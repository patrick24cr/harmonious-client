import axios from 'axios';
import { clientCredentials } from '../utils/client';

const dbUrl = clientCredentials.databaseURL;

const getQuestionsByTile = (tile) => new Promise((resolve, reject) => {
  axios.get(`${dbUrl}/questions?tile=${tile}`)
    .then((response) => {
      // lots of formatting to render the server response to my old client side JSON pattern, because the button generation was so dependent on that pattern
      const formattedResponse = [{}];
      response.data.forEach((element) => {
        let a1 = null;
        let a2 = null;
        let a3 = null;
        let a4 = null;
        let a1Correct = 0;
        let a2Correct = 0;
        let a3Correct = 0;
        let a4Correct = 0;
        if (element.aspect1 != null) {
          a1 = [element.aspect1.option2, element.aspect1.option3, element.aspect1.option4];
          a1Correct = Math.floor(Math.random() * 4);
          a1.splice(a1Correct, 0, element.aspect1.optionCorrect);
        }
        if (element.aspect2 != null) {
          a2 = [element.aspect2.option2, element.aspect2.option3, element.aspect2.option4];
          a2Correct = Math.floor(Math.random() * 4);
          a2.splice(a2Correct, 0, element.aspect2.optionCorrect);
        }
        if (element.aspect3 != null) {
          a3 = [element.aspect3.option2, element.aspect3.option3, element.aspect3.option4];
          a3Correct = Math.floor(Math.random() * 4);
          a3.splice(a3Correct, 0, element.aspect3.optionCorrect);
        }
        if (element.aspect4 != null) {
          a4 = [element.aspect4.option2, element.aspect4.option3, element.aspect4.option4];
          a4Correct = Math.floor(Math.random() * 4);
          a4.splice(a4Correct, 0, element.aspect4.optionCorrect);
        }
        const responseColumns = [a1, a2, a3, a4];
        const responseCorrect = [a1Correct.toString(), a2Correct.toString(), a3Correct.toString(), a4Correct.toString()];
        const packagedResponses = {};
        const packagedCorrect = {};
        let columnNumber = 0;
        responseColumns.forEach((column) => {
          if (column != null) {
            packagedResponses[columnNumber] = column;
            packagedCorrect[columnNumber] = responseCorrect[columnNumber];
            columnNumber += 1;
          }
        });
        formattedResponse.push({
          id: element.id,
          english: element.english,
          spanish: element.spanish,
          responses: packagedResponses,
          correct: packagedCorrect,
        });
      });
      formattedResponse.shift();
      console.warn(formattedResponse);
      resolve(formattedResponse);
    })
    .catch((error) => reject(error));
});

export default getQuestionsByTile;
