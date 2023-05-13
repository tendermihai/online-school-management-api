import fs from "fs";
import path from "path";

export function getStudents() {
  return new Promise((resolve, reject) => {
    fs.readFile("./app/student/data.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const students = JSON.parse(data);
        resolve(students);
      }
    });
  });
}

export async function getSortStudents(field) {
  let students = await getStudents();

  for (let i = 0; i < students.length; i++) {
    for (let j = i + 1; j < students.length; j++) {
      if (students[i][field] > students[j][field]) {
        let aux = students[i];
        students[i] = students[j];
        students[j] = aux;
      }
    }
  }

  return students;
}

export async function getById(id) {
  let students = await getStudents();
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      return students[i];
    }
  }
  return null;
}

export function save(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./app/student/data.json",
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

export async function deleteStudent(id) {
  console.log("deleting student with ID", id);
  let student = await getStudents();

  let filter = [];
  for (let i = 0; i < student.length; i++) {
    if (student[i].id !== id) {
      filter.push(student[i]);
    }
  }

  await save(filter);
  console.log("student with ID", id, "deleted");
  return id;
}

export async function updateStudent(editableStudent) {
  let data = await getStudents();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === editableStudent.id) {
      if (editableStudent.firstName === editableStudent.firstName) {
        data[i].firstName = editableStudent.firstName;
      }

      if (editableStudent.lastName === editableStudent.lastName) {
        data[i].lastName = editableStudent.lastName;
      }
      if (editableStudent.email === editableStudent.email) {
        data[i].email = editableStudent.email;
      }
      if (editableStudent.age === editableStudent.age) {
        data[i].age = editableStudent.age;
      }
    }
  }
  save(data);
}

export async function addStudent(student) {
  let students = await getStudents();
  student.id = await generateId();
  students.push(student);
  save(students);
}

export async function generateId() {
  let students = await getStudents();

  let id = Math.random() * 1000000 + 10000 + "";

  while (verifyId(students, id) == true) {
    id = Math.random() * 1000000 + 10000 + "";
  }

  return id.replace(".", "");
}

export async function verifyId(students, id) {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      return true;
    }
  }
  return false;
}

export async function verifyLogin(email, password) {
  let students = await getStudents();
  for (let i = 0; i < students.length; i++) {
    if (students[i].email === email && students[i].password === password) {
      return students[i];
    }
  }
  return null;
}
