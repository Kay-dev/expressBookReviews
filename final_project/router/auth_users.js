const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    let userWithUsername = users.filter((user) => {
        return user.username === username;
    });
    if (userWithUsername.length > 0) {
        return true;
    } else {
        return false;
    }
};

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    let validUser = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    if (validUser.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // check if username and password are valid
    if (!username || !password) {
        return res
            .status(300)
            .json({ message: "Please provide username and password" });
    }
    // check if username and password match
    if (authenticatedUser(username, password)) {
        // generate access token
        let accessToken = jwt.sign(
            {
                data: username,
            },
            "access",
            { expiresIn: 60 * 60 }
        );
        // store access token in session
        req.session.authorization = {
            accessToken,
            username,
        };
        return res
            .status(200)
            .json({ message: "You are successfully logged in" });
    } else {
        return res.status(300).json({
            message: "Invalid credentials. Check username and password",
        });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.data;
    let book = books[isbn];
    book.reviews[username] = review;
    books[isbn] = book;
    return res.status(200).json({ message: "Review added successfully" });     

});


regd_users.delete("/auth/review/:isbn", (req, res) => {

    const username = req.user.data;
    const isbn = req.params.isbn;
    let book = books[isbn];
    delete book.reviews[username];
    books[isbn] = book;
    return res.status(200).json({ message: "Review for the book has deleted successfully" });

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
