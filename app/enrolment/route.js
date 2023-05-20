import express from "express";
import {
  getEnrolment,
  getById,
  generateId,
  verifyId,
  updateEnrolment,
  deleteEnrolment,
  addEnrolment,
} from "./repository.js";

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
    let enrolments = await getEnrolment();
    response.status(200).json(enrolments);
  })
);

app.get(
  "/sort/:field",
  asyncHandler(async (request, response) => {
    let enrolments = getSortEnrolments(request.params.field);
    response.status(200).json(enrolments);
  })
);

app.get(
  "/find/id/:id",
  asyncHandler(async (request, response) => {
    let enrolment = await getById(request.params.id);

    if (enrolment !== null) {
      response.status(200).json(enrolment);
    } else {
      response
        .status(400)
        .json({ message: "Enrolmentul nu este in baza de date" });
    }
  })
);

app.delete(
  "/delete/id/:id",
  asyncHandler(async (request, response) => {
    const id = request.params.id;
    console.log(id, "id delete");

    if ((await getById(id)) == null) {
      response.status(400).json({ message: "Could not find ID" });
    } else {
      await deleteEnrolment(id);
      response
        .status(200)
        .json({ message: `Enrolment with ID ${id} deleted successfully` });
    }
  })
);

app.put(
  "/update",
  asyncHandler(async (request, response) => {
    await updateEnrolment(request.body.enrolment);
    response.status(200).json(request.body.enrolment);
  })
);

app.post(
  "/add",
  asyncHandler(async (request, response) => {
    let enrolment = {
      studentId: request.body.studentId,
      courseId: request.body.courseId,
      createdAt: request.body.createdAt,
    };

    await addEnrolment(enrolment);
    response.status(200).json(enrolment);
  })
);

export default app;
