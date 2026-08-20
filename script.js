// Mobile navigation
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// Show the answer on lesson practice cards
const answerButtons = document.querySelectorAll('.answer-reveal');
answerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const answerText = button.parentElement.querySelector('.hidden-answer');
    answerText.textContent = `Answer: ${button.dataset.answer}`;
    button.textContent = 'Answer shown';
    button.disabled = true;
  });
});

// The quiz runs only on quiz.html
const quizQuestions = [
  { topic: 'Grammar', question: 'I ____ to school every day.', answers: ['go', 'goes', 'going', 'went'], correct: 0, explanation: "Use 'go' with I, you, we, and they." },
  { topic: 'Grammar', question: 'Look! The children ____ football.', answers: ['play', 'plays', 'are playing', 'played'], correct: 2, explanation: "Use 'are playing' for an action happening now." },
  { topic: 'Grammar', question: 'We ____ a film last night.', answers: ['watch', 'watched', 'are watching', 'watches'], correct: 1, explanation: "'Last night' shows the past, so use 'watched'." },
  { topic: 'Grammar', question: 'She is going ____ visit her grandmother.', answers: ['at', 'for', 'to', 'on'], correct: 2, explanation: "The future form is 'going to + verb'." },
  { topic: 'Vocabulary', question: 'How ____ apples do you want?', answers: ['much', 'many', 'any', 'some'], correct: 1, explanation: "Use 'many' with countable plural nouns such as apples." },
  { topic: 'Sentence completion', question: 'Can you ____ me with this exercise?', answers: ['help', 'helps', 'helped', 'helping'], correct: 0, explanation: "After 'can', use the base form of the verb: help." },
  { topic: 'Vocabulary', question: 'The pharmacy is ____ to the bank.', answers: ['next', 'between', 'under', 'at'], correct: 0, explanation: "The phrase is 'next to', meaning beside." },
  { topic: 'Sentence completion', question: 'My car is ____ than my old car.', answers: ['fast', 'faster', 'fastest', 'more fast'], correct: 1, explanation: "Use 'faster than' to compare two things." },
  { topic: 'Reading', question: 'Mina gets up at 6:30. She eats breakfast and walks to school. How does Mina go to school?', answers: ['By bus', 'By car', 'On foot', 'By bicycle'], correct: 2, explanation: "'Walks to school' means she goes on foot." },
  { topic: 'Reading', question: 'Tom likes drawing. He draws pictures every Sunday. What is Tom talking about?', answers: ['His job', 'His hobby', 'His family', 'His food'], correct: 1, explanation: "A hobby is an activity we enjoy in our free time." }
];

let currentQuestion = 0;
let quizScore = 0;
let selectedOption = null;
const questionNumber = document.querySelector('#question-number');
const score = document.querySelector('#score');
const progressBar = document.querySelector('#progress-bar');
const quizTopic = document.querySelector('#quiz-topic');
const questionText = document.querySelector('#question-text');
const answerArea = document.querySelector('#quiz-answers');
const feedback = document.querySelector('#quiz-feedback');
const quizButton = document.querySelector('#quiz-button');
const quizResult = document.querySelector('#quiz-result');

function showQuestion() {
  const item = quizQuestions[currentQuestion];
  selectedOption = null;
  questionNumber.textContent = `QUESTION ${currentQuestion + 1} OF ${quizQuestions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
  quizTopic.textContent = item.topic;
  questionText.textContent = item.question;
  feedback.textContent = '';
  feedback.className = 'quiz-feedback';
  quizButton.disabled = true;
  quizButton.textContent = 'Check Answer →';
  answerArea.innerHTML = '';

  item.answers.forEach((answer, index) => {
    const option = document.createElement('button');
    option.className = 'quiz-answer';
    option.type = 'button';
    option.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span>${answer}</span>`;
    option.addEventListener('click', () => chooseAnswer(option, index));
    answerArea.appendChild(option);
  });
}

function chooseAnswer(option, index) {
  if (selectedOption !== null) return;
  selectedOption = index;
  option.classList.add('selected');
  quizButton.disabled = false;
  quizButton.textContent = 'See Answer →';
}

function checkAnswer() {
  const item = quizQuestions[currentQuestion];
  const options = [...answerArea.children];
  options.forEach((option, index) => {
    option.disabled = true;
    if (index === item.correct) option.classList.add('correct');
    if (index === selectedOption && index !== item.correct) option.classList.add('incorrect');
  });
  if (selectedOption === item.correct) {
    quizScore += 1;
    score.textContent = quizScore;
    feedback.textContent = `Correct! ${item.explanation}`;
    feedback.classList.add('good');
  } else {
    feedback.textContent = `Not quite. ${item.explanation}`;
    feedback.classList.add('bad');
  }
  quizButton.textContent = currentQuestion === quizQuestions.length - 1 ? 'See Score →' : 'Next Question →';
  quizButton.dataset.checked = 'true';
}

function nextQuestion() {
  if (quizButton.dataset.checked !== 'true') {
    checkAnswer();
    return;
  }
  currentQuestion += 1;
  if (currentQuestion < quizQuestions.length) showQuestion();
  else showResult();
}

function showResult() {
  answerArea.hidden = true;
  questionText.hidden = true;
  quizTopic.hidden = true;
  feedback.hidden = true;
  quizButton.hidden = true;
  quizResult.hidden = false;
  const percent = Math.round((quizScore / quizQuestions.length) * 100);
  document.querySelector('#result-title').textContent = percent >= 80 ? 'Excellent work!' : percent >= 50 ? 'Good work!' : 'Keep practising!';
  document.querySelector('#result-text').textContent = `You scored ${quizScore} out of ${quizQuestions.length} (${percent}%). Review the lessons and try again.`;
}

function restartQuiz() {
  currentQuestion = 0;
  quizScore = 0;
  score.textContent = '0';
  answerArea.hidden = false;
  questionText.hidden = false;
  quizTopic.hidden = false;
  feedback.hidden = false;
  quizButton.hidden = false;
  quizResult.hidden = true;
  quizButton.dataset.checked = 'false';
  showQuestion();
}

if (questionText && answerArea) {
  quizButton.addEventListener('click', nextQuestion);
  document.querySelector('#try-again').addEventListener('click', restartQuiz);
  showQuestion();
}
