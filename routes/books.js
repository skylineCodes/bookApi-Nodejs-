/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const express = require('express');
const booksController = require('../controllers/booksController');

function routes(Book) {
  const bookRouter = express.Router();
  const controller = booksController(Book);
  // Fetch all books
  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get);
  bookRouter.use('/book/:bookId', (req, res, next) => {
    const ID = req.params.bookId;
    Book.findById(ID, (err, book) => {
      if (err) {
        return res.send(err);
      }
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });
  // Fetch single book by ID
  bookRouter.route('/book/:bookId')
    .get((req, res) => {
      const returnBook = req.book.toJSON();

      returnBook.links = {};
      returnBook.links.FilterByThisGenre = `http://${req.headers.host}/api/books?genre=${req.book.genre}`;
      res.json(returnBook);
    })
    .patch((req, res) => {
      const { book } = req;

      if (req.body._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;
