import express, { json, request, response } from "express";

import studentRoute from "./student/routes/studentRoute.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/v1/students", studentRoute);

app.listen(2020, () => {
  console.log("express is listening on 2020");
});
