class GroupSubjectEntity {
    constructor(id, groupId, professorSubjectId, hours) {
        this.id = id;
        this.groupId=groupId;
        this.professorSubjectId=professorSubjectId;
        this.hours = hours;
    }
}

module.exports = GroupSubjectEntity;