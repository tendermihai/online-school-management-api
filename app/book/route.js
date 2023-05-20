import express from "express";
import {
  getBooks,
  getSortBooks,
  deleteBook,
  updateBook,
  getById,
  verifyId,
  addBook,
  findBookByStudentId,
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
    let books = await getBooks();
    response.status(200).json(books);
  })
);

app.get(
  "/sort/:field",
  asyncHandler(async (request, response) => {
    let books = getSortBooks(request.params.field);
    response.status(200).json(books);
  })
);

app.get(
  "/find/:studentId",
  asyncHandler(async (request, response) => {
    let books = await findBookByStudentId(request.params.studentId);
    response.status(200).json(books);
  })
);

app.get(
  "/find/id/:id",
  asyncHandler(async (request, response) => {
    let book = await getById(request.params.id);
    console.log(book, "this is book");
    if (book !== null) {
      response.status(200).json(book);
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
      await deleteBook(id);
      response
        .status(200)
        .json({ message: `Student with ID ${id} deleted successfully`, id });
    }
  })
);

app.put(
  "/update",
  asyncHandler(async (request, response) => {
    await updateBook(request.body.book);
    response.status(200).json(request.body.book);
    // console.log(request.body.book, "body of book");
  })
);

app.post(
  "/add",
  asyncHandler(async (request, response) => {
    let book = {
      bookName: request.body.bookName,
      createdAt: request.body.createdAt,
    };

    await addBook(book);
    response.status(200).json(book);
  })
);

export default app;
