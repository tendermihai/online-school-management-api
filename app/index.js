import express, { json, request, response } from "express";

import route from "./student/route.js";
import book from "./book/book.js";
import course from "./course/course.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1/students", route);
app.use("/api/v1/books", book);
app.use("/api/v1/courses", course);

app.listen(2020, () => {
  console.log("express is listening on 2020");
});
