import express from "express";
import {
  getCourses,
  generateId,
  verifyId,
  updateCourses,
  addCourse,
  deleteCourse,
  getSortCourses,
  getById,
} from "./repository.js";
import { findEnrolmentsByStundetId } from "../enrolment/repository.js";

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
    let courses = await getCourses();
    response.status(200).json(courses);
  })
);

// endpoint with status
app.get(
  "/all/status/:studentId",
  asyncHandler(async (request, response) => {
    let studentId = request.params.studentId;

    let enrolments = await findEnrolmentsByStundetId(studentId);

    let courses = await getCourses();

    let enrolledCorses = [];
    courses.forEach((course) => {
      let arr = enrolments.filter(
        (enrolment) => enrolment.courseId === course.id
      );

      if (arr.length > 0) {
        enrolledCorses.push({
          ...course,
          isEnroled: true,
          enrolmentId: arr[0].id,
        });
      } else {
        enrolledCorses.push({ ...course, isEnroled: false });
      }
    });

    response.json(enrolledCorses).status(200);
  })
);

app.get(
  "/sort/:field",
  asyncHandler(async (request, response) => {
    let courses = getSortCourses(request.params.field);
    response.status(200).json(courses);
  })
);

app.get(
  "/find/id/:id",
  asyncHandler(async (request, response) => {
    let course = await getById(request.params.id);

    if (course !== null) {
      response.status(200).json(course);
    } else {
      response.status(400).json({ message: "Cursul nu este in baza de date" });
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
      await deleteCourse(id);
      response
        .status(200)
        .json({ message: `Course with ID ${id} deleted successfully`, id });
    }
  })
);

app.put(
  "/update",
  asyncHandler(async (request, response) => {
    await updateCourses(request.body.course);
    response.status(200).json(request.body.course);
  })
);

app.post(
  "/add",
  asyncHandler(async (request, response) => {
    let course = {
      name: request.body.name,
      department: request.body.department,
    };

    await addCourse(course);
    response.status(200).json(course);
  })
);

export default app;
