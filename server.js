require("dotenv").config()
const multer = require("multer")
const exp = require("express")
const app = exp()
const upload = multer({dest: "uploads"})
const mongoose = require("mongoose")
const File = require("./models/File")

mongoose.connect(process.env.DATABASE_URL)

app.set("view engine","ejs")

app.get("/",(req,res) =>{
    res.render("index")
})

app.post("/upload", upload.single("file"), async (req,res) =>{
    const fd = {
        path: req.file.path,
        originalName: req.file.originalname
    }
    const file = await File.create(fd)

    res.render("index",{fileLink: `${req.headers.origin}/file/${file.id}`})
})

app.get("/file/:id", async (req,res)=>{
    const file = await File.findById(req.params.id)
    file.downloadCount++
    await file.save()

    res.download(file.path, file.originalName)
})

app.listen(process.env.PORT)