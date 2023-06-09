import express from "express";
import {
  getStudents,
  getSortStudents,
  getById,
  deleteStudent,
  updateStudent,
  addStudent,
  verifyLogin,
} from "../student/repository.js";

const app = express.Router();

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

app.get(
  "/all",
  asyncHandler(async (request, response) => {
    let students = await getStudents();
    response.status(200).json(students);
  })
);

app.get(
  "/sort/:field",
  asyncHandler(async (request, response) => {
    let students = getSortStudents(request.params.field);
    response.status(200).json(students);
  })
);

app.get(
  "/find/id/:id",
  asyncHandler(async (request, response) => {
    let student = await getById(request.params.id);
    if (student !== null) {
      response.status(200).json(student);
    } else {
      response
        .status(400)
        .json({ message: "Studentul nu este in baza de date" });
    }
  })
);

app.delete(
  "/delete/id/:id",
  asyncHandler(async (request, response) => {
    const id = request.params.id;

    if ((await getById(id)) == null) {
      response.status(400).json({ message: "Could not find ID" });
    } else {
      await deleteStudent(id);
      response
        .status(200)
        .json({ message: `Student with ID ${id} deleted successfully`, id });
    }
  })
);

app.put(
  "/update",
  asyncHandler(async (request, response) => {
    await updateStudent(request.body.student);
    response.status(200).json(request.body.student);
  })
);

app.post(
  "/add",
  asyncHandler(async (request, response) => {
    let student = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
      age: request.body.age,
    };

    await addStudent(student);
    response.status(200).json(student);
  })
);

app.post("/login", async (request, response) => {
  let login = {
    email: request.body.email,
    password: request.body.password,
  };

  let resp = await verifyLogin(request.body.email, request.body.password);

  if (resp == null) {
    response.status(403).json("Credentials are not correct.");
  } else {
    response.status(200).json(resp);
  }
});
//

app.post(
  "/register",
  asyncHandler(async (request, response) => {
    let register = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      password: request.body.password,
      email: request.body.email,
      age: request.body.age,
    };

    await addStudent(register);
    response.status(200).json(register);
  })
);
//email si pass verificam

export default app;
