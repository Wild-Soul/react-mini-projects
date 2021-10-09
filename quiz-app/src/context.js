import axios from 'axios'
import React, { useState, useContext } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  // to show setup form -- once that form is submitted we'll have data to fetch quiz Qs.
  // At that time this will be set false.
  const [waiting, setWaiting] = useState(true);

  // to show loader -- for example while fetching quiz Qs.
  const [loading, setLoading] = useState(false);

  // list of questions will be asked during quiz. -- array
  const [questions, setQuestions] = useState([]);
  // Index of the question being asked. -- integer
  const [index, setIndex] = useState(0);
  // correct answers count. -- integer
  const [correct, setCorrect] = useState(0);
  // in case some error happens. -- boolean
  const [error, setError] = useState(false);

  // to show modal -- to display results when we complete quiz.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // to maintain the state of setup form.
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sports',
    difficulty: 'easy'
  });

  // Fetch questions for quiz.
  const fetchQuestions = async (url) => {
    setLoading(true);
    setWaiting(false);
    const response = await axios.get(url).catch(err => console.log(err));

    if (response) {
      const data = response.data.results;
      if (data.length > 0) {
        setQuestions(data);
        setLoading(false);
        setError(false);
        setWaiting(false);
      } else {
        setWaiting(true);
        setError(true);
      }
    } else {
      setWaiting(true); // in case response is not there, cause of error.
    }
  }

  const nextQuestion = () => {
    setIndex((oldIdx) => {
      let idx = oldIdx + 1;
      if (idx > questions.length - 1) {
        // open modal to show final result.
        openModal();
        return 0;
      }
      return idx;
    })
  }

  const checkAnswer = value => {
    if (value) {
      setCorrect((oldVal) => oldVal + 1);
    }
    nextQuestion();
  }

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setWaiting(true);
    setCorrect(0);
    setIsModalOpen(false);
  }

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuiz({...quiz, [name]: value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const {amount, category, difficulty} = quiz;
    const url = `${API_ENDPOINT}amount=${amount}&category=${table[category]}&difficulty=${difficulty}&type=multiple`;
    // console.log("url", url);
    fetchQuestions(url);
  }

  return <AppContext.Provider value={{
    waiting, loading, questions, index, correct, error, isModalOpen, nextQuestion, checkAnswer, closeModal, quiz, handleChange, handleSubmit
  }}>{children}</AppContext.Provider>
}
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
