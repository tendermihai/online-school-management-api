import fs from "fs";
import path from "path";

export function getBooks() {
  return new Promise((resolve, reject) => {
    fs.readFile("./app/book/data.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const book = JSON.parse(data);
        resolve(book);
      }
    });
  });
}

export async function getSortBooks(field) {
  let books = await getBooks();

  for (let i = 0; i < books.length; i++) {
    for (let j = i + 1; j < books.length; j++) {
      if (books[i][field] > books[j][field]) {
        let aux = books[i];
        books[i] = books[j];
        books[j] = aux;
      }
    }
  }

  return books;
}

export async function getById(id) {
  let books = await getBooks();
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      return books[i];
    }
  }
  return null;
}

export function save(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile("./app/book/data.json", JSON.stringify(data), (err, data) => {
      if (err) {
        reject(err);
      } else {
        console.log("Data saved to file:");
        resolve();
      }
    });
  });
}

export async function deleteBook(id) {
  console.log("deleting book with ID", id);
  let book = await getBooks();

  let filter = [];
  for (let i = 0; i < book.length; i++) {
    if (book[i].id !== id) {
      filter.push(book[i]);
    }
  }

  await save(filter);
  console.log("book with ID", id, "deleted");
  return id;
}

export async function updateBook(editableBook) {
  let data = await getBooks();
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === editableBook.id) {
      if (editableBook.bookName === editableBook.bookName) {
        data[i].bookName = editableBook.bookName;
      }

      if (editableBook.createdAt === editableBook.createdAt) {
        data[i].createdAt = editableBook.createdAt;
      }
    }
  }
  save(data);
}

export async function addBook(book) {
  let books = await getBooks();
  book.id = await generateId();
  books.push(book);
  save(books);
}

export async function generateId() {
  let books = await getBooks();

  let id = Math.random() * 1000000 + 10000 + "";

  while (verifyId(books, id) == true) {
    id = Math.random() * 1000000 + 10000 + "";
  }

  return id.replace(".", "");
}

export async function verifyId(books, id) {
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      return true;
    }
  }
  return false;
}

export async function findBookByStudentId(studentId) {
  let books = await getBooks();
  return books.filter((elem) => elem.studentId === studentId);
}
