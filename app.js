import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// In-memory storage for posts
let posts = [];

// Route to display all posts
app.get("/", (req, res) => {
  res.render("index", { posts });
});

// Route to display the form for creating a new post
app.get("/new", (req, res) => {
  res.render("new");
});

// Route to handle form submission for creating a new post
app.post("/new", (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    body: req.body.body,
  };
  posts.push(newPost);
  res.redirect("/");
});

// Route to display the form for editing an existing post
app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  res.render("edit", { post });
});

// Route to handle form submission for updating an existing post
app.post("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  post.title = req.body.title;
  post.body = req.body.body;
  res.redirect("/");
});

// Route to handle post deletion
app.post("/delete/:id", (req, res) => {
  posts = posts.filter((p) => p.id != req.params.id);
  res.redirect("/");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
