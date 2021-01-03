const mongoose = require('mongoose')


const db = mongoose.createConnection("mongodb+srv://gourav:64072242@cluster0.jtxne.mongodb.net/todoApp?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// schema
const userSchema = new mongoose.Schema({
  userName: String,
  password: String,
});

const todoSchema = new mongoose.Schema({
  task: String,
  done: Boolean,
  time: Date,
  userId: mongoose.Schema.Types.ObjectId,
});
// models
exports.userModel = db.model("user", userSchema);
exports.todoModel = db.model("todo", todoSchema);
