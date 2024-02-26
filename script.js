fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    createTest(data);
  })
  .catch((error) => console.error("Помилка завантаження файлу JSON:", error));

function createTest(testData) {
  const testForm = document.getElementById("testForm");
  const testNameSpan = document.getElementById("testName");
  const resultDiv = document.getElementById("result");
  const submitBtn = document.getElementById("submitBtn");

  testNameSpan.textContent = testData.testName;

  testData.questions.forEach((question, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    questionDiv.innerHTML = `<h3>Питання ${index + 1}: ${
      question.question
    }</h3>`;

    question.answers.forEach((answer) => {
      const answerInput = document.createElement("input");
      answerInput.type = "radio";
      answerInput.name = `question${index}`;
      answerInput.value = answer.answer;
      answerInput.dataset.isCorrect = answer.isCorrect;

      const answerLabel = document.createElement("label");
      answerLabel.textContent = answer.answer;

      questionDiv.appendChild(answerInput);
      questionDiv.appendChild(answerLabel);
      questionDiv.appendChild(document.createElement("br"));
    });

    testForm.appendChild(questionDiv);
  });

  submitBtn.addEventListener("click", () => {
    let score = 0;
    const questions = testForm.querySelectorAll(".question");

    questions.forEach((question, index) => {
      const selectedAnswer = question.querySelector(
        `input[name="question${index}"]:checked`
      );
      if (selectedAnswer && selectedAnswer.dataset.isCorrect === "true") {
        score++;
        // Позначення правильної відповіді
        selectedAnswer.parentElement.classList.add("correct");
      } else if (selectedAnswer) {
        // Позначення неправильної відповіді
        selectedAnswer.parentElement.classList.add("incorrect");
      }
    });

    const totalQuestions = testData.questions.length;
    const percentage = (score / totalQuestions) * 100;
    resultDiv.textContent = `Ваш результат: ${score} з ${totalQuestions} (${percentage.toFixed(
      2
    )}%)`;

    const restartBtn = document.getElementById("restartBtn");
    restartBtn.style.display = "block";
    submitBtn.style.display = "none";
  });

  const restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", () => {
    resultDiv.textContent = "";
    // Скасування позначення правильних та неправильних відповідей
    const answers = testForm.querySelectorAll("input[type=radio]");
    answers.forEach((answer) => {
      answer.parentElement.classList.remove("correct", "incorrect");
    });
    testForm.reset();
    restartBtn.style.display = "none";
    submitBtn.style.display = "block";
  });
}
