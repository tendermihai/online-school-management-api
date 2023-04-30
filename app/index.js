import express, { json, request, response } from "express";

import route from "./student/route.js";
import book from "./book/route.js";
import course from "./course/route.js";
import enrolment from "./enrolment/route.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1/students", route);
app.use("/api/v1/books", book);
app.use("/api/v1/courses", course);
app.use("/api/v1/enrolments", enrolment);

app.listen(2020, () => {
  console.log("express is listening on 2020");
});
