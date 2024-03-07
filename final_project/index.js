const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const users = require('./router/auth_users.js').users;

const app = express();

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization){
        const token = req.session.authorization["accessToken"];
        jwt.verify(token, "access", (err, decoded) => {
          if(!err){
            req.user = decoded;
            next();
          } else {
            return res.status(300).json({ message: "User not authenticated" });
          }
        })
    } else{
      return res.status(300).json({ message: "User not logged in" });
    }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
