import React from "react"

export default function Intro(props) {
  const [categoriesData, setCategoriesData] = React.useState([])
  React.useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategoriesData(data.trivia_categories))
    return
  }, [])
  const categoryElements = categoriesData.map((category) => {
    return (
      <option value={category.id} key={category.id}>
        {category.name}
      </option>
    )
  })

  return (
    <div className="intro-container">
      <h1>My awesome quiz</h1>
      <form>
        <div className="form-line">
          <label htmlFor="numOfQuestions">Number of questions:</label>
          <input
            className="num-select"
            id="numOfQuestions"
            name="numOfQuestions"
            type="number"
            min="3"
            max="10"
            value={props.quizSetup.numOfQuestions}
            placeholder="1 to 10"
            required
            onChange={() => props.handleSetupChange(event)}
          />
        </div>
        <div className="form-line">
          <label htmlFor="category">Category:</label>
          <select
            className="cat-select"
            id="category"
            name="category"
            value={props.quizSetup.category}
            onChange={() => props.handleSetupChange(event)}
          >
            <option value="">All categories</option>
            {categoryElements}
          </select>
        </div>
        <button onClick={props.startQuiz} className="start-quiz-btn">
          Start quiz
        </button>
      </form>
    </div>
  )
}
