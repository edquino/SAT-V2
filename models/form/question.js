function QuestionModel({sectionId,
    questionId,
    questionTitle,
    questionType,
    dependent,
    dependentMultiple,
    dependentSectionId,
    dependentQuestionId,
    questionDependentAnswer,
    questionDependentQuestions,
    dependentAnswer,
    type,
    required,
    hint,
    limit,
    mask,
    min,
    max,
    format,
    hasChild,
    principalChild,
    children,
    answer,
    answers
    }) { 

        this.sectionId = sectionId,
        this.questionId = questionId,
        this.questionTitle = questionTitle,
        this.questionType = questionType,
        this.required = required,
        this.dependent = dependent,
        this.dependentMultiple = dependentMultiple,
        this.dependentSectionId = dependentSectionId,
        this.dependentQuestionId = dependentQuestionId,
        this.questionDependentAnswer = questionDependentAnswer,
        this.questionDependentQuestions = questionDependentQuestions,
        this.dependentAnswer = dependentAnswer,
        this.type = type,

        //Default
        this.hint = hint,
        this.limit = limit,
        this.mask = mask,

        //Numeric - Date
        this.min = min,
        this.max = max,

        //Date
        this.format = format,

        //Closed or Dropdown
        this.hasChild = hasChild,
        this.principalChild = principalChild,
        this.children = children  ,

        this.answer = answer,
        this.answers = answers
}

QuestionModel.prototype.toJson = function () {
    return {
        "section_id": this.sectionId,
        "question_id": this.questionId,
        "question_title": this.questionTitle,
        "question_type": this.questionType,
        "required": this.required,
        "dependent": this.dependent,
        "dependent_section_id": this.dependentSectionId,
        "dependent_question_id": this.dependentQuestionId,
        "dependent_multiple": this.dependentMultiple,
        "dependent_question_ids": this.questionDependentQuestions,
        "dependent_answer": this.dependentAnswer,
        "type": this.type,
        "hint": this.hint,
        "limit": this.limit,
        "mask":this.mask,
        "format": this.format,
        "has_child":this.hasChild,
        "principal_child": this.principalChild,
        "children":this.children,
        "answer": this.answer,
        "answers": this.answers

    };
}

module.exports = QuestionModel;