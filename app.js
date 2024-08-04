import express from 'express'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'
import { getNotes, getNote, createNote } from './database.js'
import { getText } from './ocr.js'
import multer from 'multer'

var fileUpload = multer({ dest: './tmp/' }).single('ocrphoto[]');

//Getting directory for easy path to html files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
//app.use(express.json())
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname + "/public")));
//app.use(bodyParser);


app.get("/notes", async (req, res) => {
    const notes = await getNotes()
    res.send(notes)
})

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id
    const note = await getNote(id)
    res.send(note)
})

app.post("/notes", async (req, res) => {
    const { title, contents } = req.body
    const note = await createNote(title, contents)

    res.status(201).send(note)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get('/', (req, res) => {
    res.render('index', { title: 'Front End Test', message: 'Message' })
})

app.get('/ocr', async (req, res) => {
    const message = "Please upload a file"
    res.render('ocr', { message: message })
})

app.post('/ocr', fileUpload, async (req, res) => {
    console.log(req.file.path)
    const filePath = req.file.path
    let message = "Please upload a valid image file"
    message = await getText(req.file.path)
    res.render('ocr', { message: message })
})

app.listen(8080, () => {
    console.log("Server is running on port 8080")
})