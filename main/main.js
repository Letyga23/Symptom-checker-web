const selectQuestionnaireBtn = document.getElementById(
  "selectQuestionnaireBtn"
);
const selectQuestionnaireSection = document.getElementById(
  "selectQuestionnaireSection"
);

const aboutAppBtn = document.getElementById("aboutAppBtn");
const aboutAppSection = document.getElementById("aboutAppSection");

const supportBtn = document.getElementById("supportBtn");
const supportSection = document.getElementById("supportSection");

const emailEl = document.getElementById("email");

const profileButton = document.getElementById("profileButton");
const profileIcon = document.getElementById("profileIcon");

const surveyButtons = document.querySelectorAll('.survey-button');

function hideAllSections() {
  [selectQuestionnaireSection, aboutAppSection, supportSection].forEach(
    (sec) => {
      sec.style.display = "none";
    }
  );
  updateArrows();
}

function toggleSection(section, btn) {
  const isVisible = section.style.display === "flex";
  hideAllSections();
  if (!isVisible) {
    section.style.display = "flex";
  }
  updateArrows();
}

surveyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.type;
    window.location.href = `../survey/survey.html?type=${type}`;
  });
});

function updateArrows() {
  [
    { btn: selectQuestionnaireBtn, sec: selectQuestionnaireSection },
    { btn: aboutAppBtn, sec: aboutAppSection },
    { btn: supportBtn, sec: supportSection },
  ].forEach(({ btn, sec }) => {
    const arrow = btn.querySelector(".arrow");
    if (sec.style.display === "flex") {
      arrow.textContent = "▲";
      btn.classList.add("active");
    } else {
      arrow.textContent = "▼";
      btn.classList.remove("active");
    }
  });
}

// Начальное скрытие секций
hideAllSections();

selectQuestionnaireBtn.addEventListener("click", () =>
  toggleSection(selectQuestionnaireSection, selectQuestionnaireBtn)
);
aboutAppBtn.addEventListener("click", () =>
  toggleSection(aboutAppSection, aboutAppBtn)
);
supportBtn.addEventListener("click", () =>
  toggleSection(supportSection, supportBtn)
);

emailEl.addEventListener("click", () => {
  const email = emailEl.textContent;
  navigator.clipboard.writeText(email).then(() => {
    alert("Почта скопирована в буфер обмена");
  });
});

profileButton.addEventListener("click", () => {
  alert("Переход в профиль");
});

profileIcon.addEventListener("click", () => {
  alert("Переход в профиль");
});
