import {
  RiskAssessment,
  RiskGroup,
  SurveyType
} from "./riskAssessment.js";

function init() {
  // Элементы DOM
  const elements = {
    scoreEl: document.getElementById("score"),
    groupEl: document.getElementById("group"),
    recommendationsEl: document.getElementById("sectionRecomendations"),
    btnRecomendations: document.getElementById("btnRecomendations"),
    rememberNoteEl: document.getElementById("sectionRememberNote"),
    btnRememberNote: document.getElementById("btnRememberNote"),
    btnGoHome: document.getElementById("goToMainPage"),
    btnSavePDF: document.getElementById("saveInPDF"),
  };

  // Управление секциями
  function hideAllSections() {
    [elements.recommendationsEl, elements.rememberNoteEl].forEach((sec) => {
      sec.style.display = "none";
    });
    updateArrows();
  }

  function toggleSection(section, btn) {
    const isVisible = section.style.display === "flex";
    hideAllSections();
    if (!isVisible) section.style.display = "flex";
    updateArrows();
  }

  function updateArrows() {
    [
      { btn: elements.btnRecomendations, sec: elements.recommendationsEl },
      { btn: elements.btnRememberNote, sec: elements.rememberNoteEl },
    ].forEach(({ btn, sec }) => {
      const arrow = btn.querySelector(".arrow");
      const isOpen = sec.style.display === "flex";
      arrow.textContent = isOpen ? "▲" : "▼";
      btn.classList.toggle("active", isOpen);
    });
  }

  // Обработка параметров из URL
  const urlParams = new URLSearchParams(window.location.search);
  const surveyTypeStr = (urlParams.get("type") || "").toUpperCase();
  const scoreStr = urlParams.get("score");
  const score = parseFloat(scoreStr);

  const surveyType = Object.values(SurveyType).includes(surveyTypeStr)
    ? surveyTypeStr
    : null;

  const riskGroup = surveyType
    ? RiskAssessment.getRiskGroupFor(surveyType, score)
    : RiskGroup.UNCERTAINTY;

  // Отображение результатов
  elements.scoreEl.textContent = scoreStr;
  elements.groupEl.textContent = RiskAssessment.getNameGroup(riskGroup);
  elements.recommendationsEl.textContent = RiskAssessment.getRecommendationText(riskGroup);

  // События
  hideAllSections();

  elements.btnRecomendations.addEventListener("click", () =>
    toggleSection(elements.recommendationsEl, elements.btnRecomendations)
  );
  elements.btnRememberNote.addEventListener("click", () =>
    toggleSection(elements.rememberNoteEl, elements.btnRememberNote)
  );
  elements.btnGoHome.addEventListener("click", () => {
    window.location.href = "../main/main.html";
  });
  elements.btnSavePDF.addEventListener("click", () => {
    alert("Открытие PDF (заглушка)");
  });
}

window.addEventListener("DOMContentLoaded", init);
