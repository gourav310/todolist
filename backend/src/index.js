console.log("working");
 const  {userModel,todoModel} = require('./database');

// const user = new userModel({
//     userName:"Gourav",
//     password:"123456" 
// })
// user.save();

const PORT = process.env.PORT ||9999; 
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");

 

const app = express();
app.use(express.json()); 
app.use(cors({
    credentials: true,
    origin: "https://todo---react.herokuapp.com"
}));
app.set('trust proxy',1);
app.use(
  session({
    secret: "todoApp",
    cookie: { maxAge: 1*60*60*1000,sameSite:'none',secure:true }
  })
);

const isNullOrUndefined = (val) => val === null || val === undefined;
const SALT = 2;

app.post("/signup", async (req, res) => {
  const { userName, password } = req.body;
  const existingUser = await userModel.findOne({ userName });
  if (isNullOrUndefined(existingUser)) {
  
    const hashpass = bcrypt.hashSync(password, SALT);
    const newUser = new userModel({ userName, password: hashpass });

    await newUser.save();
    req.session.userId = newUser._id;
    res.status(201).send({ success: "Signed in" });
  } else {
    res.status(400).send({
      err: `UserName ${userName} already exists. Please choose another.`,
    });
  }
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  console.log("here")
  const existingUser = await userModel.findOne({
    userName
  });

  if (isNullOrUndefined(existingUser)) {
    res.status(401).send({ err: "UserName does not exist." });
  } else {
    const hashedPwd = existingUser.password;
    if (bcrypt.compareSync(password, hashedPwd)) {
      req.session.userId = existingUser._id;
    
      res.status(200).send({ success: "Logged in" });
    } else {
      res.status(401).send({ err: "Password is incorrect." });
    }
  }
});

const AuthMiddleware = async (req, res, next) => {
    //console.log(req.session)
  if (isNullOrUndefined(req.session) || isNullOrUndefined(req.session.userId) ) {
    res.status(401).send({ err: "Not logged in" });
  } else {
    next();
  }
};

app.get('/userinfo', AuthMiddleware, async (req, res) => {
    const user = await userModel.findById(req.session.userId);
    res.send({ userName : user.userName });
});

app.post("/addTodo", AuthMiddleware, async (req, res) => {
    const todo = req.body;
    todo.creationTime = new Date();
    todo.done = false;
    todo.userId = req.session.userId;
    const newTodo = new todoModel(todo);
    await newTodo.save();
    res.status(201).send(newTodo);
  });


app.get("/todo", AuthMiddleware, async (req, res) => {
    const allTodos = await todoModel.find({ userId: req.session.userId });
    res.send(allTodos);
  });

app.delete("/todo/:todoid", AuthMiddleware, async (req, res) => {
    const todoid = req.params.todoid;
    try {
      await todoModel.deleteOne({ _id: todoid, userId: req.session.userId });
      res.sendStatus(200);
    } catch (e) {
      res.status(404).send({error: "cannot delete todo"});
    }
  });
  

app.get("/logout", (req, res)=> {
    if(!isNullOrUndefined(req.session)) {
        // destroy the session
        req.session.destroy(() => {
            res.sendStatus(200);
        });

    } else {
        res.sendStatus(200);
    }
});



app.put("/todo/:todoid", AuthMiddleware, async (req, res) => {
    const { task } = req.body;
    const todoid = req.params.todoid;
  
    
    const todo = await todoModel.findOne({ _id: todoid, userId: req.session.userId });
    if (isNullOrUndefined(todo)) {
    res.sendStatus(404);
    } else {
    todo.task = task;
    await todo.save();
    res.send(todo);
    }
 
  });




app.put("/doneTodo/:todoid", AuthMiddleware, async (req, res) => {
    const { done } = req.body;
    const todoid = req.params.todoid;
  
    
    const todo = await todoModel.findOne({ _id: todoid, userId: req.session.userId });
    if (isNullOrUndefined(todo)) {
    res.sendStatus(404);
    } else {
    todo.done = done;
    await todo.save();
    res.send(todo);
    }
 
  });
app.listen(PORT);