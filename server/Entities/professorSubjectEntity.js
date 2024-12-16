class ProfessorSubjectEntity {
    constructor(id, professorId, subjectId) {
        this.id = id;
        this.professorId='${professors_'+professorId+'_id}';
        this.professorFirstName='${professors_'+professorId+'_firstName}';
        this.professorLastName='${professors_'+professorId+'_lastName}';
        this.subjectName='${subjects_'+subjectId+'_name}';
    }
}

module.exports = ProfessorSubjectEntity;