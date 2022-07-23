import React from "react"
import Question from "./Question"
import Intro from "./Intro"
import { nanoid } from "nanoid"

export default function App() {
  const [quizRunning, setQuizRunning] = React.useState(
    JSON.parse(localStorage.getItem("currentQuiz")) ? true : false
  )

  const [quizSetup, setQuizSetup] = React.useState({
    numOfQuestions: "5",
    category: "",
  })

  function handleSetupChange(event) {
    const { name, value } = event.target
    setQuizSetup((prevQuizSetup) => ({
      ...prevQuizSetup,
      [name]: value,
    }))
  }

  function startQuiz() {
    quizSetup.numOfQuestions >= 3 && setQuizRunning(true)
  }

  const [quizData, setQuizData] = React.useState(
    JSON.parse(localStorage.getItem("currentQuiz")) || []
  )
  const [showAnswers, setShowAnswers] = React.useState(false)
  // const [newGameSwitch, setNewGameSwitch] = React.useState(false)
  const [isAllAnswered, setIsAllAnswered] = React.useState(false)

  function createQuizData(item) {
    return {
      question: item.question,
      answers: [
        {
          value: item.correct_answer,
          correct: true,
          selected: false,
          id: nanoid(),
        },
        ...item.incorrect_answers.map((incAnswer) => {
          return {
            value: incAnswer,
            correct: false,
            selected: false,
            id: nanoid(),
          }
        }),
      ].sort(() => Math.random() - 0.5),
      answered: false,
      id: nanoid(),
    }
  }

  function lockAnswer(questionId, answerId) {
    if (!showAnswers) {
      setQuizData((prevQuizData) =>
        prevQuizData.map((item) => {
          return item.id === questionId
            ? {
                ...item,
                answered: true,
                answers: item.answers.map((answer) => {
                  return answer.id === answerId
                    ? { ...answer, selected: true }
                    : { ...answer, selected: false }
                }),
              }
            : item
        })
      )
    }
  }

  const [numOfCorrect, setNumOfCorrect] = React.useState(0)

  function checkAnswers() {
    quizData.forEach((item) => {
      item.answers.forEach((answer) => {
        if (answer.selected && answer.correct) {
          setNumOfCorrect((prevNumOfCorrect) => prevNumOfCorrect + 1)
        }
      })
    })
    setShowAnswers(true)
  }

  function newQuiz() {
    setQuizRunning(false)
    localStorage.clear()
    setQuizData([])
    setNumOfCorrect(0)
    setIsAllAnswered(false)
    setShowAnswers(false)
    // setNewGameSwitch(prevNewGameSwitch => !prevNewGameSwitch)
  }

  function quizButtonDisplay() {
    if (!showAnswers) {
      return isAllAnswered ? (
        <button className="check-answers-btn" onClick={checkAnswers}>
          Check answers
        </button>
      ) : (
        <div>
          <button className="check-answers-btn disabled">Check answers</button>
          <div className="answer-all-msg"> Please answer all questions </div>
        </div>
      )
    }

    return (
      <div className="result-container">
        <span className="your-score">
          You scored {numOfCorrect}/{quizData.length} corrent answers
        </span>
        <button className="new-quiz-btn" onClick={newQuiz}>
          New quiz
        </button>
      </div>
    )
  }

  const questionElements = quizData.map((item) => {
    return (
      <Question
        question={item.question}
        answers={item.answers}
        key={item.id}
        id={item.id}
        lockAnswer={lockAnswer}
        showAnswers={showAnswers}
      />
    )
  })

  React.useEffect(() => {
    if (quizRunning && !quizData.length) {
      fetch(`https://opentdb.com/api.php?amount=
                ${quizSetup.numOfQuestions}&category=${quizSetup.category}
                `)
        .then((res) => res.json())
        .then((data) => setQuizData(data.results.map(createQuizData)))
    }
  }, [quizRunning])

  React.useEffect(() => {
    quizData.length &&
      localStorage.setItem("currentQuiz", JSON.stringify(quizData))
    quizData.length &&
      quizData.every((item) => item.answered) &&
      setIsAllAnswered(true)
  }, [quizData])

  return (
    <main>
      {!quizRunning ? (
        <Intro
          startQuiz={startQuiz}
          quizSetup={quizSetup}
          handleSetupChange={handleSetupChange}
        />
      ) : (
        <div className="quiz-container">
          {questionElements}
          {quizButtonDisplay()}
        </div>
      )}
    </main>
  )
}
