const express = require("express");
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const key = require("./key");
const middlewares = require("./middlewares");


app.get("/login", (req, res) =>{
  const user = req.query;
  let token = jwt.sign(user, key.secret);
  localStorage.setItem("jwttoken", token);
  res.json(token);
});


app.get('/image',middlewares.validity,middlewares.ThumbnailCreation,(req,res)=>{
	res.send("Successfully downloaded and thumbnail created");
	
});


app.get('*', function(req, res){
  res.send(JSON.stringify({ error: "404 Page Not Found" }));
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});