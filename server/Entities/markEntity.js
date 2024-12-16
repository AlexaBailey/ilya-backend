class MarkEntity {
    constructor(id, mark, studentId, evaluationId) {
        this.id = id;
        this.evaluationId = evaluationId;
        this.studentId = studentId;
        this.mark = mark;
    }
}

module.exports = MarkEntity;