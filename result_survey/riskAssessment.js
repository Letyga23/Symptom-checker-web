const context = {
  recommendationGroupRiskFree: 'Профилактический осмотр 1 раз в год у акушера-гинеколога, в смотровом кабинете или у маммолога',
  recommendationGroupUncertainty: 'Дополнительное обследование и динамическое наблюдение акушера-гинеколога или маммолога',
  recommendationGroupRisk: 'Консультация онколога',
  
  groupRiskFree: 'Группа низкого риска',
  groupUncertainty: 'Группа неопределённости',
  groupRisk: 'Группа высокого риска',
  
  cervix: 'Шейка матки',
  mammary_glands: 'Молочные железы',
  uterine_body: 'Тело матки',
  ovaries: 'Яичники'
};

export const RiskGroup = {
  RISK_FREE: 'RISK_FREE',
  UNCERTAINTY: 'UNCERTAINTY',
  RISK: 'RISK'
};

export const SurveyType = {
  CERVIX: 'CERVIX',
  MAMMARY_GLANDS: 'MAMMARY_GLANDS',
  UTERINE_BODY: 'UTERINE_BODY',
  OVARIES: 'OVARIES'
};

export class RiskAssessment {
  static getRiskGroupFor(type, score) {
    switch (type) {
      case SurveyType.CERVIX:
      case SurveyType.MAMMARY_GLANDS:
        return this.getRiskGroup(score, 12.5, -10);
      case SurveyType.UTERINE_BODY:
      case SurveyType.OVARIES:
        return this.getRiskGroup(score, 13, -13);
      default:
        return RiskGroup.UNCERTAINTY;
    }
  }

  static getRiskGroup(score, thresholdRisk, thresholdUncertainty) {
    if (score >= thresholdRisk) return RiskGroup.RISK;
    else if (score >= thresholdUncertainty) return RiskGroup.UNCERTAINTY;
    else return RiskGroup.RISK_FREE;
  }

  static getRecommendationText(group) {
    switch (group) {
      case RiskGroup.RISK_FREE:
        return context.recommendationGroupRiskFree;
      case RiskGroup.UNCERTAINTY:
        return context.recommendationGroupUncertainty;
      case RiskGroup.RISK:
        return context.recommendationGroupRisk;
      default:
        return '';
    }
  }

  static getNameGroup(group) {
    switch (group) {
      case RiskGroup.RISK_FREE:
        return context.groupRiskFree;
      case RiskGroup.UNCERTAINTY:
        return context.groupUncertainty;
      case RiskGroup.RISK:
        return context.groupRisk;
      default:
        return '';
    }
  }

  static getNameTypeSurvey(surveyType) {
    switch (surveyType) {
      case SurveyType.CERVIX:
        return context.cervix;
      case SurveyType.MAMMARY_GLANDS:
        return context.mammary_glands;
      case SurveyType.UTERINE_BODY:
        return context.uterine_body;
      case SurveyType.OVARIES:
        return context.ovaries;
      default:
        return '';
    }
  }
}
