import React from "react"
import { nanoid } from "nanoid"

export default function Question(props) {
  function setButtonClass(answer) {
    let currentClass = "sngl-answer"
    if (answer.selected) {
      currentClass += " selected"
    }

    if (props.showAnswers && answer.correct) {
      currentClass += " correct-answer"
    } else if (props.showAnswers && !answer.correct) {
      currentClass += " wrong-answer"
    }
    return currentClass
  }

  const answerElements = props.answers.map((answer) => {
    return (
      <button
        className={setButtonClass(answer)}
        dangerouslySetInnerHTML={{ __html: answer.value }}
        key={answer.id}
        id={answer.id}
        onClick={() => props.lockAnswer(props.id, answer.id)}
      ></button>
    )
  })
  return (
    <div className="qustion-sngl-container">
      <h2
        dangerouslySetInnerHTML={{ __html: props.question }}
        className="question"
      ></h2>
      <div className="answers">{answerElements}</div>
    </div>
  )
}
