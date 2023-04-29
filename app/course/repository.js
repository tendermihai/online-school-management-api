import fs from "fs";
import path from "path";

export function getCourses() {
  return new Promise((resolve, reject) => {
    fs.readFile("./app/course/data.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const course = JSON.parse(data);
        resolve(course);
      }
    });
  });
}

export async function getSortCourses(field) {
  let courses = await getCourses();

  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      if (courses[i][field] > courses[j][field]) {
        let aux = courses[i];
        courses[i] = courses[j];
        courses[j] = aux;
      }
    }
  }

  return courses;
}

export async function getById(id) {
  let courses = await getCourses();
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].id === id) {
      return courses[i];
    }
  }
  return null;
}

export function save(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./app/course/data.json",
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

export async function deleteCourse(id) {
  console.log("deleting course with ID", id);
  let course = await getCourses();

  let filter = [];
  for (let i = 0; i < course.length; i++) {
    if (course[i].id !== id) {
      filter.push(course[i]);
    }
  }

  await save(filter);
  console.log("course with ID", id, "deleted");
  return id;
}

export async function updateCourses(editableCourse) {
  let data = await getCourses();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === editableCourse.id) {
      if (editableCourse.name === editableCourse.name) {
        data[i].name = editableCourse.name;
      }

      if (editableCourse.department === editableCourse.department) {
        data[i].department = editableCourse.department;
      }
    }
  }
  save(data);
}

export async function addCourse(course) {
  let courses = await getCourses();
  course.id = await generateId();
  courses.push(course);
  save(courses);
}

export async function generateId() {
  let courses = await getCourses();

  let id = Math.random() * 1000000 + 10000 + "";

  while (verifyId(courses, id) == true) {
    id = Math.random() * 1000000 + 10000 + "";
  }

  return id.replace(".", "");
}

export async function verifyId(courses, id) {
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].id === id) {
      return true;
    }
  }
  return false;
}
