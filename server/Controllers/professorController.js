const Professor = require("../Entities/professorEntity");
const ProfessorSubject = require("../Entities/professorSubjectEntity");
const formData = require("./formData");
const fs = require("fs").promises;
const { encoding, decoding } = require("../archiving/archiving");
const writeToFile = require("./writeDataToFile");
const path = require("node:path");

class professorController {
  async getAll(req, res) {
    const professors = decoding("professors");
    professors.professors = await formData(professors.professors);
    res.json(professors.professors);
  }

  async getById(req, res) {
    const id = req.params.id;
    let professors = decoding("professors");
    for (let professor of professors.professors) {
      if (professor.id === +id) {
        const professorSubjects = decoding("professorSubject");
        professorSubjects.professorSubjects = (
          await formData(professorSubjects.professorSubjects)
        ).filter((val) => {
          return val.professorId === +id;
        });
        professor["subjects"] = professorSubjects.professorSubjects;
        const schedule = decoding("schedule");
        schedule.schedule = (await formData(schedule.schedule)).filter(
          (val) => {
            return val.professorId === +id;
          }
        );
        professor["schedule"] = schedule.schedule.sort((a, b) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateA - dateB;
        });
        const evaluation = decoding("evaluation");
        evaluation.evaluation = (await formData(evaluation.evaluation)).filter(
          (val) => {
            return val.professorId === +id;
          }
        );
        professor["evaluation"] = evaluation.evaluation;
        return res.json(professor);
      }
    }
    res.end("not found professor with id=" + id);
  }

  async create(req, res) {
    let data = req.body;
    let professors = decoding("professors");
    let professor = new Professor(
      professors.lastId + 1,
      data.firstName,
      data.lastName,
      data.dateOfBirth
    );
    professors.lastId = professor.id;
    professors.professors.push(professor);
    try {
      encoding(professors, "professors");
      console.log("Professor added successfully");
    } catch (error) {
      console.error("Error updating file:", error);
      res.status(400).send("error");
    }
    res.status(200).end("success");
  }

  async delete(req, res) {
    const id = req.params.id;
    let professors = decoding("professors");
    professors.professors = professors.professors.filter(
      (professor) => professor.id !== +id
    );
    try {
      encoding(professors, "professors");
      res.status(200).end("success");
    } catch (error) {
      res.status(400).send("error");
    }
  }

  async put(req, res) {
    const id = req.params.id;
    const data = req.body;
    let professors = decoding("professors");
    for (let professor of professors.professors) {
      if (professor.id === +id) {
        professor.firstName = data.firstName;
        professor.lastName = data.lastName;
        professor.dateOfBirth = data.dateOfBirth;
        break;
      }
    }
    try {
      encoding(professors, "professors");
      res.status(200).end("success");
    } catch (error) {
      console.log(error);
      res.status(400).send("error");
    }
  }

  async deleteSchedule(req, res) {
    const scheduleId = req.params.scheduleId;
    let schedule = decoding("schedule");
    schedule.schedule = schedule.schedule.filter(
      (schedule) => schedule.id !== +scheduleId
    );
    try {
      encoding(schedule, "schedule");
      res.status(200).end("success");
    } catch (error) {
      res.status(400).send("error");
    }
  }

  async deleteEvaluation(req, res) {
    const evaluationId = req.params.evaluationId;
    let evaluation = decoding("evaluation");
    evaluation.evaluation = evaluation.evaluation.filter((val) => {
      return val.id !== +evaluationId;
    });
    try {
      encoding(evaluation, "evaluation");
      res.status(200).end("success");
    } catch (error) {
      res.status(400).send("error");
    }
  }

  async deleteSubject(req, res) {
    const subjectId = req.params.subjectId;
    let professorSubject = decoding("professorSubject");
    professorSubject.professorSubjects =
      professorSubject.professorSubjects.filter((subject) => {
        return subject.id !== +subjectId;
      });
    try {
      encoding(professorSubject, "professorSubject");
      res.status(200).end("success");
    } catch (error) {
      res.status(400).send("error");
    }
  }

  async addProfessorSubject(req, res) {
    const subjectId = req.params.subjectId;
    const id = req.params.id;
    let professorSubject = decoding("professorSubject");
    let newProfessorSubject = new ProfessorSubject(
      professorSubject.lastId + 1,
      id,
      subjectId
    );
    professorSubject.professorSubjects.push(newProfessorSubject);
    try {
      encoding(professorSubject, "professorSubject");
      res.status(200).end("success");
    } catch (error) {
      res.status(400).send("error");
    }
  }

  async getFileById(req, res) {
    const id = req.params.id;
    let professors = decoding("professors");
    for (let professor of professors.professors) {
      if (professor.id === +id) {
        const professorSubjects = decoding("professorSubject");
        professorSubjects.professorSubjects = (
          await formData(professorSubjects.professorSubjects)
        ).filter((val) => {
          return val.professorId === +id;
        });
        professor["subjects"] = professorSubjects.professorSubjects;
        const schedule = decoding("schedule");
        schedule.schedule = (await formData(schedule.schedule)).filter(
          (val) => {
            return val.professorId === +id;
          }
        );
        professor["schedule"] = schedule.schedule.sort((a, b) => {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);
          return dateA - dateB;
        });
        const evaluation = decoding("evaluation");
        evaluation.evaluation = (await formData(evaluation.evaluation)).filter(
          (val) => {
            return val.professorId === +id;
          }
        );
        professor["evaluation"] = evaluation.evaluation;
        let file = writeToFile(`professor_${professor.id}`, professor);
        let filePath = path.resolve(__dirname, "..", "Static", file);
        return res.download(filePath, file, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send("error");
          }
        });
      }
    }
    res.end("not found professor with id=" + id);
  }
}

module.exports = new professorController();
