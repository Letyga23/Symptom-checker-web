class Question {
constructor(questionText, options, multipleAnswers = false, dependsOnQuestion = null, dependsOnAnswers = null) {
this.questionText = questionText;
this.options = options;
this.multipleAnswers = multipleAnswers;
this.dependsOnQuestion = dependsOnQuestion;
this.dependsOnAnswers = dependsOnAnswers;
}

getQuestionText() {
return this.questionText;
}

getOptions() {
return this.options;
}

getDependsOnQuestion() {
return this.dependsOnQuestion;
}

getDependsOnAnswers() {
return this.dependsOnAnswers;
}

isMultipleAnswers() {
return this.multipleAnswers;
}

shouldBeVisible(answers) {
if (!this.dependsOnQuestion || !this.dependsOnAnswers) return true;
const givenAnswer = answers[this.dependsOnQuestion];
return givenAnswer != null && this.dependsOnAnswers.includes(givenAnswer);
}
}

export default Question;