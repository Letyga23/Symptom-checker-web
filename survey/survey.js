import OvariesSurvey from "./surveys/questions/ovariesSurvey.js";
import CervixSurvey from "./surveys/questions/cervixSurvey.js";
import UterineBodySurvey from "./surveys/questions/uterineBodySurvey.js";
import MammaryGlandsSurvey from "./surveys/questions/mammaryGlandsSurvey.js";

// Реестр доступных опросов
const surveyStrategies = {
  cervix: CervixSurvey,
  uterine_body: UterineBodySurvey,
  ovaries: OvariesSurvey,
  mammary_glands: MammaryGlandsSurvey,
};

const params = new URLSearchParams(window.location.search);
const surveyType = params.get("type") || "cervix";

const titleEl = document.getElementById("toolbarTitle");
const questionTitleEl = document.getElementById("questionTitle");
const respOptLay = document.getElementById("respOptLay");
const backButton = document.getElementById("Back");
const furtherButton = document.getElementById("Further");
const backToMainBtn = document.getElementById("backToMainBtn");

let currentQuestionIndex = 1;
let surveyInstance = null;

function confirmExitAndGoBack() {
  const saved = localStorage.getItem(`survey_${surveyType}_answers`);
  if (saved) {
    const leave = confirm(
      "Вы уверены, что хотите выйти? Прогресс будет потерян."
    );
    if (!leave) return false;
  }
  localStorage.removeItem(`survey_${surveyType}_answers`);
  window.location.href = "../main/main.html";
  return true;
}

function init() {
  if (!surveyStrategies[surveyType]) {
    titleEl.textContent = "Неизвестная анкета";
    respOptLay.innerHTML = "<p>Выбран неверный тип анкеты.</p>";
    backButton.disabled = true;
    furtherButton.disabled = true;
    return;
  }

  surveyInstance = new surveyStrategies[surveyType]();

  const newTitle = surveyInstance.getTitle();
  titleEl.textContent = newTitle;
  document.title = newTitle;
  loadQuestion();

  backButton.addEventListener("click", () => navigateQuestion(-1));
  furtherButton.addEventListener("click", () => navigateQuestion(1));

  backToMainBtn.addEventListener("click", () => {
    confirmExitAndGoBack();
  });

  window.addEventListener("popstate", () => {
    if (!confirmExitAndGoBack()) {
      // Если пользователь не хочет уходить, возвращаем состояние страницы
      history.pushState(null, "", window.location.href);
    }
  });

  // Добавляем фиктивное состояние в историю, чтобы popstate сработал корректно
  history.pushState(null, "", window.location.href);

  loadAnswersFromStorage();
}

function loadQuestion() {
  const questionsMap = surveyInstance.getQuestions(); 
  const question = questionsMap.get(currentQuestionIndex);
  if (!question) return;

  questionTitleEl.textContent = `(${currentQuestionIndex}/${questionsMap.size}) ${question.questionText}`;
  respOptLay.innerHTML = "";

  const selectedOptionIndices =
    surveyInstance.getAnswerForQuestion(currentQuestionIndex);
  const scoresMap = surveyInstance.getScores();
  const scoresForQuestion = scoresMap.get(currentQuestionIndex); // получаем баллы для текущего вопроса

  question.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-button";

    let text = option;
    if (scoresForQuestion && scoresForQuestion[i] !== undefined) {
      text += ` (${scoresForQuestion[i].toFixed(2)})`;
    }
    btn.textContent = text;

    if (selectedOptionIndices.includes(i)) {
      btn.classList.add("selected");
    }

    btn.addEventListener("click", () => onOptionClick(i));
    respOptLay.appendChild(btn);
  });

  backButton.disabled = currentQuestionIndex === 1;
  furtherButton.disabled = selectedOptionIndices.length === 0;
  furtherButton.textContent =
    currentQuestionIndex === questionsMap.size ? "Завершить" : "Далее";
}

function onOptionClick(index) {
  const questionsMap = surveyInstance.getQuestions();
  const question = questionsMap.get(currentQuestionIndex);
  let selected = surveyInstance.getAnswerForQuestion(currentQuestionIndex);

  if (question.multipleAnswers) {
    if (selected.includes(index)) {
      selected = selected.filter((i) => i !== index);
    } else {
      selected.push(index);
    }
  } else {
    selected = selected.includes(index) ? [] : [index];
  }

  surveyInstance.setAnswerForQuestion(currentQuestionIndex, selected);
  saveAnswersToStorage();

  updateOptionButtons(selected);
  furtherButton.disabled = selected.length === 0;
}

function updateOptionButtons(selectedOptionIndices) {
  const buttons = respOptLay.querySelectorAll(".option-button");
  buttons.forEach((btn, i) => {
    btn.classList.toggle("selected", selectedOptionIndices.includes(i));
  });
}

function navigateQuestion(direction) {
  const questionsMap = surveyInstance.getQuestions();
  const maxIndex = questionsMap.size;

  const newIndex = currentQuestionIndex + direction;
  if (newIndex >= 1 && newIndex <= maxIndex) {
    currentQuestionIndex = newIndex;
    loadQuestion();
  } else if (newIndex > maxIndex) {
    finishSurvey();
  }
}

function finishSurvey() {
  const totalScore = calculateTotalScore();

  const params = new URLSearchParams({
    type: surveyType,
    score: totalScore.toFixed(2),
  });

  window.location.href = `../result_survey/result_survey.html?${params.toString()}`;
}

function saveAnswersToStorage() {
  const answersMap = surveyInstance.answers;
  const answersObj = {};
  for (const [key, value] of answersMap.entries()) {
    answersObj[key] = value.length > 0 ? value : null;
  }
  localStorage.setItem(
    `survey_${surveyType}_answers`,
    JSON.stringify(answersObj)
  );
}

function loadAnswersFromStorage() {
  const saved = localStorage.getItem(`survey_${surveyType}_answers`);
  if (!saved) return;

  const answersObj = JSON.parse(saved);
  for (const key in answersObj) {
    if (Object.hasOwnProperty.call(answersObj, key)) {
      const arr = answersObj[key];
      if (arr && arr.length > 0) {
        surveyInstance.setAnswerForQuestion(Number(key), arr);
      }
    }
  }
}

function calculateTotalScore() {
  const scoresMap = surveyInstance.getScores();
  const questionsMap = surveyInstance.getQuestions();
  let total = 0;

  for (const [key, question] of questionsMap.entries()) {
    const answerIndices = surveyInstance.getAnswerForQuestion(key);
    if (!answerIndices || answerIndices.length === 0) continue;

    const scoresForQuestion = scoresMap.get(key);
    if (!scoresForQuestion) continue;

    answerIndices.forEach((idx) => {
      if (scoresForQuestion[idx] !== undefined) {
        total += scoresForQuestion[idx];
      }
    });
  }

  return total;
}

// Инициализация
init();
