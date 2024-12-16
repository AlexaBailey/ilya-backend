const { promises: fs } = require("fs");
const Subject = require("../Entities/subjectEntity");
const {encoding, decoding} = require("../archiving/archiving");
const writeToFile = require("./writeDataToFile");
const path = require("node:path");


class subjectController {
    async getAll(req, res) {
        const subjects = decoding('subjects');
        res.json(subjects.subjects);
    }

    async getById(req, res) {
        const id = req.params.id;
        let subjects = decoding('subjects');
        for (let subject of subjects.subjects) {
            if (subject.id === +id) {
                return res.json(subject);
            }
        }
        res.end('not found student with id=' + id);
    }

    async getFileById(req, res) {
        const id = req.params.id;
        let subjects = decoding('subjects');
        for (let subject of subjects.subjects) {
            if (subject.id === +id) {
                let file=writeToFile('subject_'+subject.id, subject);
                let filePath=path.resolve(__dirname, '..', 'Static', file);
                return res.download(filePath, file, (err)=>{
                    if(err){
                        console.log(err);
                        return res.status(500).send('error');
                    }
                });
            }
        }
        res.end('not found student with id=' + id);
    }

    async create(req, res) {
        let data = req.body;
        let subjects = decoding('subjects');
        let subject = new Subject(subjects.lastId + 1, data.name);
        subjects.lastId = subject.id;
        subjects.subjects.push(subject);
        try {
            encoding(subjects, 'subjects');
            res.status(200).end('success');
        } catch (error) {
            res.status(400).send('error');
        }
    }

    async delete(req, res) {
        const id = req.params.id;
        let subjects = decoding('subjects');
        subjects.subjects = subjects.subjects.filter(subject => subject.id !== +id);
        try {
            encoding(subjects, 'subjects');
            res.status(200).end('success');
        } catch (error) {
            res.status(400).send('error');
        }
    }

    async put(req, res) {
        const id = req.params.id;
        const data = req.body;
        let subjects = decoding('subjects');

        for (let subject of subjects.subjects) {
            if (subject.id === +id) {
                subject.name = data.name;
                break;
            }
        }

        try {
            encoding(subjects, 'subjects');
            res.status(200).end('success');
        } catch (error) {
            res.status(400).send('error');
        }
    }
}

module.exports = new subjectController();
