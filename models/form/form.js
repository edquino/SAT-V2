
function FormModel({ formId, analyzed, sentToAnalyze, sections }) {
    this.formId = formId,
    this.analyzed = analyzed,
    this.sentToAnalyze = sentToAnalyze,
    this.sections = sections
}

FormModel.prototype.toJson = function () {
    return {
        "form_id": this.formId,
        "analyzed": this.analyzed,
        "sent_to_analyze": this.sentToAnalyze,
        "sections": this.sections.map((e) => e.toJson())
    };
}

module.exports = FormModel;