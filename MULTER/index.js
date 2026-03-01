const exp = require('express');
const path = require('path');
const multer = require("multer");

const app = exp();
const PORT = 8000;

console.log("INDEX FILE LOADED 🔥");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));

app.use(exp.urlencoded({ extended: false }));

app.get('/', (req, res) => res.render("homepage"));

app.post('/upload', upload.single('profileImg'), (req, res) => {
    console.log(req.file);
    res.send("File Uploaded Successfully ✅");
});

app.listen(PORT, () => console.log("Server Started on 8000"));