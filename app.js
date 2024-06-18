import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static("public")); // Serve static files from 'public' directory
app.set("view engine", "ejs"); // Set EJS as the view engine

// In-memory storage for posts
let posts = [];

// Gets current year - used for copyrighting
const currentYear = new Date().getFullYear();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the filename with current timestamp
  },
});
const upload = multer({ storage: storage });

// Ensure the uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads"); // Create 'uploads' directory if it doesn't exist
}

// Route to display all posts with pagination
app.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5; // Number of posts per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const reversedPosts = [...posts].reverse(); // Reverse the posts array to show newest first
  const paginatedPosts = reversedPosts.slice(startIndex, endIndex); // Get the posts for the current page
  const totalPages = Math.ceil(posts.length / limit); // Calculate total number of pages

  res.render("index", {
    posts: paginatedPosts,
    currentPage: page,
    totalPages: totalPages,
    currentYear: currentYear,
  });
});

// Route to display the form for creating a new post
app.get("/new", (req, res) => {
  res.render("new", { currentYear });
});

// Route to handle form submission for creating a new post
app.post("/new", upload.single("image"), (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    body: req.body.body,
    imagePath: req.file ? `/uploads/${req.file.filename}` : null, // Save image path if file was uploaded
  };
  posts.push(newPost); // Add the new post to the posts array
  res.redirect("/"); // Redirect to home page
});

// Route to display the form for editing an existing post
app.get("/edit/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id); // Find the post by ID
  res.render("edit", { post, currentYear });
});

// Route to handle form submission for updating an existing post
app.post("/edit/:id", upload.single("image"), (req, res) => {
  const post = posts.find((p) => p.id == req.params.id); // Find the post by ID
  post.title = req.body.title;
  post.body = req.body.body;

  if (req.file) {
    // Delete the old image file if it exists
    if (post.imagePath) {
      const oldImagePath = path.join(__dirname, post.imagePath);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
        }
      });
    }
    post.imagePath = `/uploads/${req.file.filename}`; // Update the image path with the new file
  }

  res.redirect("/"); // Redirect to home page
});

// Route to handle post deletion
app.post("/delete/:id", (req, res) => {
  const postIndex = posts.findIndex((p) => p.id == req.params.id); // Find the index of the post by ID
  if (postIndex !== -1) {
    const post = posts[postIndex];
    // Delete the image file if it exists
    if (post.imagePath) {
      const imagePath = path.join(__dirname, post.imagePath);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }
    posts.splice(postIndex, 1); // Remove the post from the posts array
  }
  res.redirect("/"); // Redirect to home page
});

// Route to display a single post
app.get("/post/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id); // Find the post by ID
  if (post) {
    res.render("view", { post, currentYear }); // Render the view template with the post data
  } else {
    res.status(404).send("Post not found"); // Send a 404 response if post is not found
  }
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log message when the server starts
});
