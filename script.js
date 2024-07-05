document.addEventListener("DOMContentLoaded", () => {
  /* 
    document.addEventListener("DOMContentLoaded", () => {...}) ensures that the script runs after the DOM is fully loaded.
    */
  const quizContainer = document.getElementById("quiz");
  const resultsContainer = document.getElementById("results");
  const submitButton = document.getElementById("submit");
  let myQuestions = [];

  /* 
    Inside this function, we select the necessary DOM elements and initialize an empty array myQuestions to hold the quiz questions.
    */

  fetch("https://opentdb.com/api.php?amount=5&type=multiple")
    .then((response) => response.json())
    .then((data) => {
      myQuestions = data.results.map((questionData, index) => ({
        question: questionData.question,
        answers: {
          a: questionData.incorrect_answers[0],
          b: questionData.incorrect_answers[1],
          c: questionData.incorrect_answers[2],
          d: questionData.correct_answer,
        },
        correctAnswer: "d",

        /* 
         - We use the fetch API to get questions from the Open Trivia Database.
         - The URL https://opentdb.com/api.php?amount=5&type=multiple fetches 5 multiple-choice questions.
         - .then((response) => response.json()) processes the response as JSON.
         - In the subsequent .then((data) => {...}) block, we map the fetched data to our desired format:
         - Each question is mapped to an object with a question string, an answers object, and a correctAnswer string.
         - We assume the correct answer is always the last option (d).
          */
      }));
      buildQuiz();
    })
    .catch((error) => {
      console.error("Error fetching quiz questions:", error);
    });
  function buildQuiz() {
    const output = [];

    myQuestions.forEach((currentQuestion, questionNumber) => {
      const answers = [];

      for (const letter in currentQuestion.answers) {
        answers.push(
          `<label>
                    <input type ="radio" name="question${questionNumber}" value="${letter}">
                    ${letter} : ${currentQuestion.answers[letter]}
                    </label>`
        );
      }

      output.push(
        `<div class="question"> ${currentQuestion.question} </div>
                <div class="answers"> ${answers.join("")} </div>`
      );
    });
    quizContainer.innerHTML = output.join("");
  }
  /* 
-The buildQuiz function creates the quiz interface.
-We iterate over each question in myQuestions:
-For each question, we create a div for the question text and another div for the answers.
-The answers are generated as label elements with radio buttons, ensuring each answer option has a unique name attribute for the question.
-The generated HTML is set as the innerHTML of quizContainer.
    */

  function showResults() {
    const answerContainers = quizContainer.querySelectorAll(".answers");
    let numCorrect = 0;

    myQuestions.forEach((currentQuestion, questionNumber) => {
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;

      if (userAnswer === currentQuestion.correctAnswer) {
        numCorrect++;
        answerContainers[questionNumber].style.color = "lightgreen";
      } else {
        answerContainers[questionNumber].style.color = "red";
      }
    });
    resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
  }
  submitButton.addEventListener("click", showResults);
  //An event listener is added to the submit button to call showResults when clicked, displaying the user's score.
});

/* 
-The showResults function calculates and displays the user's score.
-It iterates over each question to check if the selected answer is correct:
-It queries the selected radio button for each question.
-If the answer is correct, it increments the numCorrect counter and highlights the answer in green.
-If the answer is incorrect, it highlights the answer in red.
-The score is displayed in resultsContainer.
*/

/* 
FUTURE CHANGES/UPDATES:

I want to add a restart option
I want the answers to randomize, not just be always answer d.
*/
