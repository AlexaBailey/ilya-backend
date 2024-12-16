const fs = require("fs");
const Student = require("../Entities/studentEntity");
const formData = require("./formData");
const {encoding, decoding} = require("../archiving/archiving");
const writeToFile = require("./writeDataToFile");
const path = require("node:path");

class studentController{
    async getAll(req, res) {
        const students = decoding('students');
        students.students=await formData(students.students);
        res.json(students.students);
    };

    async getById(req, res) {
        const id = req.params.id;
        let students=decoding('students');
        students.students=await formData(students.students);
        for(let student of students.students){
            if(student.id === +id){
                return res.json(student);
            }
        }
        res.end('not found student with id='+id);
    };

    async create(req,res){
        let data = req.body;
        let students = decoding('students');
        let student = new Student(students.lastId+1, data.firstName, data.lastName, data.group);
        students.lastId=student.id;
        students.students.push(student);
        try {
            encoding(students, 'students');
            res.status(200).end('success');
        } catch (error) {
            res.status(400).send('error');
        }
    };

    async delete(req,res){
        const id = req.params.id;
        let students = decoding('students');
        students.students = students.students.filter(student => student.id !== +id);
        try {
            encoding(students, 'students');
            res.status(200).end('success');
        } catch (error) {
            res.status(400).send('error');
        }
    };

    async put(req,res){
        const id = req.params.id;
        const data = req.body;
        let students = decoding('students');
        for (let student of students.students) {
            if (student.id === +id) {
                student.firstName = data.firstName;
                student.lastName = data.lastName;
                student.groupId = "${groups_"+data.groupId+"_id}";
                student.groupName="${groups_"+data.groupId+"_name}";
                break;
            }
        }
        try {
            encoding(students, 'students');
            res.status(200).end('success');
        } catch (error) {
            res.status(400).send('error');
        }
    };

    async getFile(req, res){
        const id = req.params.id;
        let students=decoding('students');
        students.students=await formData(students.students);
        for(let student of students.students){
            if(student.id === +id){
                let file=writeToFile(`student_${student.id}`,student);
                let filePath=path.resolve(__dirname, '..', 'Static', file);
                return res.download(filePath, file, (err)=>{
                    if(err){
                        console.log(err);
                        return res.status(500).send('error');
                    }
                });
            }
        }
        res.end('not found student with id='+id);
    };
}

module.exports = new studentController();