class BaseSurveyStrategy {
  constructor() {
    this.questions = new Map();
    this.answers = new Map();
    this.scores = new Map();
  }

  getQuestions() {
    return this.questions;
  }

  getAnswerForQuestion(questionIndex) {
    return this.answers.get(questionIndex) || [];
  }

  getAnswersAsMap() {
    const map = {};
    for (let i = 0; i < this.questions.length; i++) {
      const answerIndices = this.answers.get(i);
      if (answerIndices && answerIndices.length > 0) {
        const options = this.questions[i].options;
        const selectedAnswers = answerIndices
          .filter(index => index >= 0 && index < options.length)
          .map(index => options[index])
          .join(', ');
        map[this.questions[i].questionText] = selectedAnswers;
      }
    }
    return map;
  }

  setAnswerForQuestion(questionIndex, answerIndices) {
    if (!answerIndices || answerIndices.length === 0) {
      this.answers.delete(questionIndex);
    } else {
      this.answers.set(questionIndex, [...answerIndices]);
    }
  }

  getAnswerForQuestion(questionIndex) {
  return this.answers.get(questionIndex) || [];
}

  getScores() {
    return this.scores;
  }

  getTitle()
  {
    throw new Error("Method 'getTitle()' must be implemented.");
  }

  createQuestions()
  {
        throw new Error("Method 'createQuestions()' must be implemented.");
  }

  createScores()
  {
        throw new Error("Method 'createScores()' must be implemented.");
  }
}

export default BaseSurveyStrategy;