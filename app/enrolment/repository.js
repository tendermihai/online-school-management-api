import fs from "fs";
import path from "path";

export function getEnrolment() {
  return new Promise((resolve, reject) => {
    fs.readFile("./app/enrolment/data.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const enrolment = JSON.parse(data);
        resolve(enrolment);
      }
    });
  });
}

export async function getSortEnrolments(field) {
  let enrolments = await getEnrolment();

  for (let i = 0; i < enrolments.length; i++) {
    for (let j = i + 1; j < enrolments.length; j++) {
      if (enrolments[i][field] > enrolments[j][field]) {
        let aux = enrolments[i];
        enrolments[i] = enrolments[j];
        enrolments[j] = aux;
      }
    }
  }

  return enrolments;
}

export async function getById(id) {
  let enrolments = await getEnrolment();
  for (let i = 0; i < enrolments.length; i++) {
    if (enrolments[i].id === id) {
      return enrolments[i];
    }
  }
  return null;
}

export function save(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./app/enrolment/data.json",
      JSON.stringify(data),
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log("Data saved to file:");
          resolve();
        }
      }
    );
  });
}

export async function deleteEnrolment(id) {
  console.log("deleting enrolment with ID", id);
  let enrolment = await getEnrolment();

  let filter = [];
  for (let i = 0; i < enrolment.length; i++) {
    if (enrolment[i].id !== id) {
      filter.push(enrolment[i]);
    }
  }

  await save(filter);
  console.log("Enrolment with ID", id, "deleted");
  return id;
}

export async function updateEnrolment(editableEnrolment) {
  let data = await getEnrolment();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === editableEnrolment.id) {
      if (editableEnrolment.studentId === editableEnrolment.studentId) {
        data[i].studentId = editableEnrolment.studentId;
      }

      if (editableEnrolment.courseId === editableEnrolment.courseId) {
        data[i].courseId = editableEnrolment.courseId;
      }

      if (editableEnrolment.createdAt === editableEnrolment.createdAt) {
        data[i].createdAt = editableEnrolment.createdAt;
      }
    }
  }
  save(data);
}

export async function addEnrolment(enrolment) {
  let enrolments = await getEnrolment();
  enrolment.id = await generateId();
  enrolments.push(enrolment);
  save(enrolments);
}

export async function generateId() {
  let enrolments = await getEnrolment();

  let id = Math.random() * 1000000 + 10000 + "";

  while (verifyId(enrolments, id) == true) {
    id = Math.random() * 1000000 + 10000 + "";
  }

  return id.replace(".", "");
}

export async function verifyId(enrolments, id) {
  for (let i = 0; i < enrolments.length; i++) {
    if (enrolments[i].id === id) {
      return true;
    }
  }
  return false;
}

export async function findEnrolmentsByStundetId(studentId) {
  let enrolments = await getEnrolment();
  return enrolments.filter((enrolment) => enrolment.studentId == studentId);
}
