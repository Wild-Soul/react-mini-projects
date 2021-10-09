import React from 'react'
import { useGlobalContext } from './context'

import SetupForm from './SetupForm'
import Loading from './Loading'
import Modal from './Modal'
function App() {
  const { waiting, loading, questions, index, correct, nextQuestion, checkAnswer } = useGlobalContext();

  // if we're waiting for user to complete the setup form then show setup form.
  if (waiting) {
    return <SetupForm />
  }

  // if fetch is in progress show loader.
  if (loading) {
    return <Loading />
  }

  const { question, incorrect_answers, correct_answer, } = questions[index];
  let answers = [...incorrect_answers];
  const ansIdx = Math.floor( Math.random(new Date().getTime()) * 4 );
  if (ansIdx === 3) {
    answers.push(correct_answer);
  } else {
    answers.push(answers[ansIdx]);
    answers[ansIdx] = correct_answer;
  }

  return <main>
    <Modal />
    <section className="quiz">
      <p className="correct-answers">
        correct answers: {correct}/{index}
      </p>
      <article className="container">
        <h2 dangerouslySetInnerHTML={{ __html: question }} />

        <div className="btn-container">
          {answers.map((answer, key) => {
            return <button 
                      key={key} 
                      className="answer-btn" 
                      dangerouslySetInnerHTML={{ __html: answer }} 
                      onClick={(e) => {checkAnswer(correct_answer === answer)}}
                    />
          })}
        </div>
      </article>
      <button className="next-question" onClick={nextQuestion}>
        next question
      </button>
    </section>
  </main>
}

export default App
