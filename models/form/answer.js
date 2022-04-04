function AnswerModel({answerId,type,answer,toCompare,validated}){
    this.answerId = answerId,
    this.type = type,
    this.answer = answer,
    this.toCompare = toCompare,
    this.validated = validated
}


AnswerModel.prototype.toJson = function () {
    return {
        "answer_id": this.answerId,
        "type": this.type,
        "answer": this.answer,
        "to_compare":this.toCompare,
        "validated":this.validated
    };
}


module.exports = AnswerModel;