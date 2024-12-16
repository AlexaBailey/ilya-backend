const {promises: fs} = require("fs");
const formData = require("./formData");
const MarkEntity=require("../Entities/markEntity");
const MarksData = require("../Entities/markEntity");
const {encoding, decoding} = require("../archiving/archiving");
const writeToFile = require("./writeDataToFile");
const path = require("node:path");

class EvaluationController {

    async getById(req, res) {
        const id = req.params.id;
        try {
            let evaluationData = decoding('evaluation');
            evaluationData.evaluation=await formData(evaluationData.evaluation);
            let evaluation = evaluationData.evaluation.find(e => e.id === +id);

            if (!evaluation) {
                return res.status(404).json({ message: "Evaluation not found" });
            }
            let studentsData = decoding('students');
            studentsData.students=await formData(studentsData.students);
            let students = studentsData.students.filter(student => student.groupId === evaluation.groupId);

            let marksData = decoding('mark');
            marksData.mark=await formData(marksData.mark);
            let marks = marksData.mark.filter(mark => mark.evaluationId === evaluation.id);

            students = students.map(student => {
                let studentMark = marks.find(mark => mark.studentId === student.id);
                return {
                    ...student,
                    mark: studentMark ? studentMark.mark : null
                };
            });
            const response = {
                ...evaluation,
                students
            };

            res.json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async saveEvaluationResults(req, res) {
        const id = req.params.id;
        let marksData = decoding('mark');
        marksData.mark = await formData(marksData.mark);
        let keys = Object.keys(req.body);
        for(let i=0;i<keys.length;i++){
            let studentMark = marksData.mark.find(mark => mark.studentId === +keys[i]);
            if(!studentMark) {
                let newMark= new MarkEntity(++marksData.lastId, req.body[keys[i]], keys[i], id);
                marksData.mark.push(JSON.stringify(newMark));
            }
            else{
                studentMark.mark=req.body[keys[i]];
            }
        }
        marksData.mark = marksData.mark.map(mark => typeof mark === 'string' ? JSON.parse(mark) : mark);

        for(let i=0;i<marksData.mark.length;i++){
            marksData.mark[i].studentId='${students_'+marksData.mark[i].studentId+'_id}';
            marksData.mark[i].evaluationId='${evaluation_'+marksData.mark[i].evaluationId+'_id}';
        }
        try {
            encoding(marksData, 'mark');
            res.status(200).end('success');
        } catch (error) {
            res.status(400).send('error');
        }
    }

    async getFileById(req, res) {
        const id = req.params.id;
        try {
            let evaluationData = decoding('evaluation');
            evaluationData.evaluation=await formData(evaluationData.evaluation);
            let evaluation = evaluationData.evaluation.find(e => e.id === +id);

            if (!evaluation) {
                return res.status(404).json({ message: "Evaluation not found" });
            }
            let studentsData = decoding('students');
            studentsData.students=await formData(studentsData.students);
            let students = studentsData.students.filter(student => student.groupId === evaluation.groupId);

            let marksData = decoding('mark');
            marksData.mark=await formData(marksData.mark);
            let marks = marksData.mark.filter(mark => mark.evaluationId === evaluation.id);

            students = students.map(student => {
                let studentMark = marks.find(mark => mark.studentId === student.id);
                return {
                    ...student,
                    mark: studentMark ? studentMark.mark : null
                };
            });
            const response = {
                ...evaluation,
                students
            };

            let file=writeToFile('evaluation_'+response.id, response);
            let filePath=path.resolve(__dirname, '..', 'Static', file);
            return res.download(filePath, file, (err)=>{
                if(err){
                    console.log(err);
                    return res.status(500).send('error');
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

module.exports = new EvaluationController();