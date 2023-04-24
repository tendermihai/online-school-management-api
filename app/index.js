import express, { json, request, response } from "express";

import cors from "cors";

app.use(express.json());

app.use(cors());

app.listen(2020, () => {
  console.log("express is listening on 2020");
});
