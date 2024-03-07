const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doExistUser = (username) => {
  let userWithUsername = users.filter((user) => {
    return user.username === username;
  })
  if(userWithUsername.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(!doExistUser(username)){
      users.push({
        username,
        password
      })
      return res.status(200).json({message: "User created successfully, now you can login"});
    } else{
      return res.status(300).json({message: "User already exists"});
    }
  }
  return res.status(300).json({message: "Please provide username and password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let booksByAuthor = [];
  const author = req.params.author;
  for(let key in books){
    if(books[key].author === author){
      booksByAuthor.push(books[key]);
    }
  }
  return res.status(200).json({booksByAuthor});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let booksByTitle = [];
  const title = req.params.title;
  for(let key in books){
    if(books[key].title === title){
      booksByTitle.push(books[key]);
    }
  }
  return res.status(200).json({booksByTitle});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(300).json(books[isbn].reviews);
});



module.exports.general = public_users;
