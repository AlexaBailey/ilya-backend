const Group = require("../Entities/groupEntity");
const formData = require("./formData");
const { encoding, decoding } = require("../archiving/archiving");
const writeToFile = require("./writeDataToFile");
const path = require("node:path");
const fs = require("fs").promises;

class groupController {
  async getAll(req, res) {
    const groups = decoding("groups");
    res.json(groups.groups);
  }

  async getById(req, res) {
    const id = req.params.id;
    const groups = decoding("groups");
    for (let group of groups.groups) {
      if (group.id === +id) {
        const students = decoding("students");
        students.students = (await formData(students.students)).filter(
          (val) => {
            return val.groupId === +id;
          }
        );
        group["students"] = students.students;
        return res.json(group);
      }
    }
    res.end("not found group with id=" + id);
  }

  async create(req, res) {
    let data = req.body;
    let groups = decoding("groups");
    let group = new Group(groups.lastId + 1, data.name);
    groups.lastId = group.id;
    groups.groups.push(group);
    try {
      encoding(groups, "groups");
      console.log("Group added successfully");
    } catch (error) {
      console.error("Error updating file:", error);
      res.status(400).send("error");
    }
    res.status(200).end("success");
  }

  async delete(req, res) {
    const id = req.params.id;
    let groups = decoding("groups");
    groups.groups = groups.groups.filter((group) => group.id !== +id);
    let students = decoding("students");
    students.students = students.students.map((student) => {
      const regex = /\$\{([^}]+)\}/;
      let match = student.groupId.match(regex)[1];
      match = match.split("_");
      let Id = match[1];
      if (id == Id) {
        student.groupName = "";
        student.groupId = "";
      }
      return student;
    });
    try {
      encoding(students, "students");
      encoding(groups, "groups");
      res.status(200).end("success");
    } catch (error) {
      res.status(400).send("error");
    }
  }

  async put(req, res) {
    const id = req.params.id;
    const data = req.body;
    let groups = decoding("groups");
    for (let group of groups.groups) {
      if (group.id === +id) {
        group.name = data.name;
        break;
      }
    }
    try {
      encoding(groups, "groups");
      res.status(200).end("success");
    } catch (error) {
      res.status(400).send("error");
    }
  }

  async getFileById(req, res) {
    const id = req.params.id;
    const groups = decoding("groups");
    for (let group of groups.groups) {
      if (group.id === +id) {
        const students = decoding("students");
        students.students = (await formData(students.students)).filter(
          (val) => {
            return val.groupId === +id;
          }
        );
        group["students"] = students.students;
        let file = writeToFile("group_" + group.id, group);
        let filePath = path.resolve(__dirname, "..", "Static", file);
        return res.download(filePath, file, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send("error");
          }
        });
      }
    }
    res.end("not found group with id=" + id);
  }
}

module.exports = new groupController();
