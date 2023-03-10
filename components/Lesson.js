import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import TopNavigation from './TopNavigation';
import { useAuth } from '../utils/context/authContext';
import {
  createScore, getScoreByTileAndUser, getScoresById, updateScoreByPrimaryKey,
} from '../api/scores';
// import questions from '../../sampleData/questions.json';
import createReport from '../api/badQuestions';
// import getQuestionsByTile from '../api/questions';

export default function Lesson({ questions }) {
  const tileNumbers = ['a1', 'a2', 'a3', 'a4', 'a5', 'b1', 'b2', 'b3', 'b4', 'b5', 'c1', 'c2', 'c3', 'c4', 'c5', 'd1', 'd2', 'd3', 'd4', 'd5', 'e1', 'e2', 'e3', 'e4', 'e5'];

  const initialState = {
    problemWithEnglish: false,
    problemWithSpanish: false,
    problemDescription: '',
  };
  const { user } = useAuth();
  const router = useRouter();
  const { tile } = router.query;
  const [questionNumber, setQuestionNumber] = useState(0);
  const selectedResponses = {};
  const [numberCorrect, setNumberCorrect] = useState(0);
  const [scores, setScores] = useState({});
  const [primaryKey, setPrimaryKey] = useState({});
  const [hasUserResponded, setHasUserResponded] = useState(false);
  const [formInput, setFormInput] = useState(initialState);
  // const [questions, setQuestions] = useState(null);

  useEffect(() => {
    // getQuestionsByTile(tile).then(setQuestions);
    getScoresById(user.id).then(setScores);
    getScoreByTileAndUser((tileNumbers.indexOf(tile) + 1), user.id).then(setPrimaryKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, tile]);

  const calculateAndWriteScore = () => {
    if (scores[tile]) {
      const payload = {
        score: Math.ceil((parseInt(scores[tile], 10) + parseInt(numberCorrect, 10)) / 2),
      };
      updateScoreByPrimaryKey(primaryKey.id, payload).then(() => router.push('/'));
    } else {
      const payload = {
        tile,
        uid: user.uid,
        score: Math.ceil((parseInt(numberCorrect, 10))),
      };
      createScore(payload).then(() => router.push('/'));
    }
  };

  const showReport = () => {
    document.getElementById('quizContainer').classList.add('displayNone');
    document.getElementById('reportContainer').classList.remove('displayNone');
  };

  const advanceToNextQuestion = () => {
    const nextQuestionTasks = () => {
      if (questionNumber === questions.length - 1) {
        showReport();
        return;
      }
      setHasUserResponded(false);
      setQuestionNumber(questionNumber + 1);
      // these visual changes are instantaneous and can happen during the instant that the container is fully faded
      document.getElementById('afterQuestionButtons').classList.add('hiddenLessonElement');
      document.getElementById('responseContainer').classList.remove('disabledLessonElement');
      document.getElementById('postFeedback').classList.add('displayNone');
      document.getElementById('afterQuestionButtons').classList.remove('displayNone');
      setTimeout(document.getElementById('quizContainer').classList.remove('quizContainerFaded'), 500);
    };
      // these visual changes are on CSS transitions and need to be started early
    document.getElementById('progressBar').classList = 'progressBar';
    document.getElementById('progressBar').classList.add('progressBar00');
    document.getElementById('constructedSpanish').classList.add('hiddenLessonElement');
    document.getElementById('quizContainer').classList.add('quizContainerFaded');
    setTimeout(nextQuestionTasks, 500);
  };

  const updateResponseHighlights = () => {
    const responsesToUnhighlight = [];
    Object.keys(questions[questionNumber].responses).map((key, index) => (
      questions[questionNumber].responses[key].map((item, index2) => (
        responsesToUnhighlight.push(`${index}--${index2}`)
      ))
    ));
    responsesToUnhighlight.map((ID) => document.getElementById(ID).classList.remove('responseButtonSelected'));

    const responsesToHighlight = [];
    Object.keys(selectedResponses).map((key) => (
      responsesToHighlight.push(`${key}--${selectedResponses[key]}`)
    ));
    responsesToHighlight.map((ID) => document.getElementById(ID).classList.add('responseButtonSelected'));
  };

  const isResponseComplete = () => {
    if (Object.keys(questions[questionNumber].correct).length === Object.keys(selectedResponses).length) {
      return true;
    }
    return false;
  };

  const checkAnswerDisplayCorrection = () => {
    const isCorrect = Object.keys(questions[questionNumber].correct).every(
      (key) => Object.prototype.hasOwnProperty.call(selectedResponses, key)
                    && questions[questionNumber].correct[key] === selectedResponses[key],
    );

    const wrongResponses = [];
    Object.keys(questions[questionNumber].correct).forEach(
      (key) => {
        if (!(Object.prototype.hasOwnProperty.call(selectedResponses, key)
          && questions[questionNumber].correct[key] === selectedResponses[key])) {
          wrongResponses.push(`${key}--${selectedResponses[key]}`);
        }
      },
    );

    const responsesToCircle = [];
    Object.keys(questions[questionNumber].correct).map((key) => (
      responsesToCircle.push(`${key}--${questions[questionNumber].correct[key]}`)
    ));
    responsesToCircle.map((ID) => document.getElementById(ID).classList.add('responseButtonCorrect'));

    document.getElementById('constructedSpanish').classList.remove('hiddenLessonElement');
    document.getElementById('afterQuestionButtons').classList.remove('hiddenLessonElement');
    document.getElementById('responseContainer').classList.add('disabledLessonElement');
    wrongResponses.forEach((ID) => document.getElementById(ID)?.classList.add('responseButtonWrong'));
    if (isCorrect) {
      setNumberCorrect(numberCorrect + 1);
    }
  };

  const handleSelect = (e) => {
    const [column, word] = e.target.id.split('--');
    selectedResponses[column] = word;
    updateResponseHighlights();
    if (isResponseComplete()) {
      setHasUserResponded(true);
      checkAnswerDisplayCorrection();
    }
  };

  useEffect(() => {
    // progress bar and timer
    // allowedTime must be 6 or greater for the progress bar to function properly
    const allowedTime = 12;
    const progressBar = document.getElementById('progressBar');
    let timeElapsed = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const responseTimer = setInterval(() => {
      if (timeElapsed < allowedTime) {
        timeElapsed += 0.5;
      } else {
        clearInterval(responseTimer);
        checkAnswerDisplayCorrection();
      }
      if (hasUserResponded) {
        clearInterval(responseTimer);
      }
      switch (timeElapsed) {
        case (allowedTime - 5):
          progressBar.classList.remove('progressBar00');
          progressBar.classList.add('progressBar50');
          break;
        case (allowedTime - 4.5):
          progressBar.classList.remove('progressBar50');
          progressBar.classList.add('progressBar45');
          break;
        case (allowedTime - 4):
          progressBar.classList.remove('progressBar45');
          progressBar.classList.add('progressBar40');
          break;
        case (allowedTime - 3.5):
          progressBar.classList.remove('progressBar40');
          progressBar.classList.add('progressBar35');
          break;
        case (allowedTime - 3):
          progressBar.classList.remove('progressBar35');
          progressBar.classList.add('progressBar30');
          break;
        case (allowedTime - 2.5):
          progressBar.classList.remove('progressBar30');
          progressBar.classList.add('progressBar25');
          break;
        case (allowedTime - 2):
          progressBar.classList.remove('progressBar25');
          progressBar.classList.add('progressBar20');
          break;
        case (allowedTime - 1.5):
          progressBar.classList.remove('progressBar20');
          progressBar.classList.add('progressBar15');
          break;
        case (allowedTime - 1):
          progressBar.classList.remove('progressBar15');
          progressBar.classList.add('progressBar10');
          break;
        case (allowedTime - 0.5):
          progressBar.classList.remove('progressBar10');
          progressBar.classList.add('progressBar05');
          break;
        case (allowedTime):
          progressBar.classList.remove('progressBar05');
          progressBar.classList.add('progressBar00');
          break;
        default:
            // code block
      }
    }, 500);
    return () => clearInterval(responseTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionNumber, hasUserResponded]);

  const showBadQuestionForm = () => {
    document.getElementById('afterQuestionButtons').classList.add('displayNone');
    document.getElementById('badQuestionContainer').classList.remove('displayNone');
  };

  const hideBadQuestionForm = () => {
    document.getElementById('badQuestionContainer').classList.add('displayNone');
    document.getElementById('postFeedback').classList.remove('displayNone');
  };

  // const postFeedbackNextQuestion = () => {
  //   advanceToNextQuestion();
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    hideBadQuestionForm();
    createReport(formInput).then(setFormInput(initialState));
    document.getElementById('problemWithSpanish').removeAttribute('checked');
    document.getElementById('problemWithEnglish').removeAttribute('checked');
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'problemWithEnglish') {
      value = !formInput.problemWithEnglish;
    }
    if (name === 'problemWithSpanish') {
      value = !formInput.problemWithSpanish;
    }
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
      question: questions[questionNumber].id,
      user: user.id,
    }));
  };

  return (
    <div className="container1">
      <TopNavigation />
      <div className="quizContainer" id="quizContainer">
        <div className="questionCounter">Lesson: {tile}<br />Question: {questionNumber + 1} / {questions.length}</div>
        <div className="prompt">{questions[questionNumber].english}</div>
        <div className="constructedSpanish hiddenLessonElement" id="constructedSpanish">
          {questions[questionNumber].spanish}
        </div>
        <div className="progressBar progressBar00" id="progressBar" />
        <div className="lessonButtonContainer">
          <div className="responseContainer" id="responseContainer">
            {Object.keys(questions[questionNumber].responses).map((column, columnIndex) => (
              <div className="responseGroup" key={column}>
                {questions[questionNumber].responses[column].map((word, wordIndex) => (
                  <button type="button" className="responseButton" key={word} id={`${columnIndex}--${wordIndex}`} onClick={(e) => handleSelect(e)}>
                    {word}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="afterQuestionButtons hiddenLessonElement" id="afterQuestionButtons">
            <button type="button" className="genericLessonButton" onClick={() => advanceToNextQuestion()}>
              Next Question
            </button>
            <button type="button" className="genericLessonButton" onClick={() => showBadQuestionForm()}>
              Report Question
            </button>
          </div>
          <div className="badQuestionContainer displayNone" id="badQuestionContainer">
            <form className="badQuestionForm" onSubmit={handleSubmit}>
              <div className="badQuestionText">Where is the problem?</div>
              <div className="badQuestionRadio">
                <input type="checkbox" id="problemWithEnglish" name="problemWithEnglish" checked={formInput.problemWithEnglish} value="placeholder" onChange={handleChange} />
                <label htmlFor="problemWithEnglish">English</label>
                <input type="checkbox" id="problemWithSpanish" name="problemWithSpanish" checked={formInput.problemWithSpanish} value="placeholder" onChange={handleChange} />
                <label htmlFor="problemWithSpanish">Spanish</label>
              </div>
              <div><input className="badQuestionInput" type="text" id="problemDescription" placeholder="Describe the issue" name="problemDescription" value={formInput.problemDescription} onChange={handleChange} required /></div>
              <div className="badQuestionText2">The text of the questions/answers will automatically be included with your feedback.</div>
              <button type="submit" className="genericLessonButton">
                Submit feedback
              </button>
            </form>
          </div>
          <div className="postFeedback displayNone" id="postFeedback">
            <button type="button" className="genericLessonButton" onClick={() => advanceToNextQuestion()}>
              Next Question
            </button>
            <div className="badQuestionText2">Thank you for helping make Mosaica better.</div>
          </div>
        </div>
      </div>
      <div className="reportContainer displayNone" id="reportContainer">
        This score: {numberCorrect} <br />
        Last score: {scores[tile] ? scores[tile] : 'N/A'} <br />
        Rounded-up average: {scores[tile] ? Math.ceil((parseInt(scores[tile], 10) + parseInt(numberCorrect, 10)) / 2) : numberCorrect} <br /> <br />
        <button type="button" className="genericLessonButton" onClick={() => calculateAndWriteScore()}>
          Write to database
        </button>
      </div>
    </div>
  );
}

Lesson.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    english: PropTypes.string,
    spanish: PropTypes.string,
    responses: PropTypes.shape({
    }),
    correct: PropTypes.shape({
    }),
  })).isRequired,
};
