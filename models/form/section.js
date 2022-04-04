function SectionModel({
    sectionId,sectionTitle,boldTitle, dependent,dependentSectionId,dependentMultiple,questions,sectionDependentAnswer,sectionDependentQuestions}){
    this.sectionId = sectionId,
    this.sectionTitle = sectionTitle,
    this.boldTitle = boldTitle,
    this.dependent = dependent,
    this.dependentSectionId = dependentSectionId,
    this.dependentMultiple = dependentMultiple,
    this.questions = questions,
    this.sectionDependentAnswer = sectionDependentAnswer,
    this.sectionDependentQuestions = sectionDependentQuestions
}


SectionModel.prototype.toJson = function () {
    return {
        "section_id": this.sectionId,
        "section_title": this.sectionTitle,
        "dependent_section_id": this.dependentSectionId,
        "dependent_question_id":this. dependentQuestionId,
        "dependent_answer": this.dependentAnswer,
        "dependent_multiple": this.dependentMultiple,
        "section_dependent_questions":this.sectionDependentQuestions,
        "questions" : this.questions.map((e) => e.toJson())
    };
}


module.exports = SectionModel;