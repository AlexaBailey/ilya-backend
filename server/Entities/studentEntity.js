class StudentEntity {
    constructor(id, firstName, lastName, groupId) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.groupId="${groups_"+groupId+"_id}";
        this.groupName="${groups_"+groupId+"_name}";
    }
}

module.exports = StudentEntity;