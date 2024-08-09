import express from 'express'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'
import { getNotes, getNote, createNote } from './database.js'
import { getText } from './ocr.js'
import multer from 'multer'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import i18nextMiddleware from 'i18next-http-middleware';
import { Router } from 'express';
import fs from 'fs';

import i18next from './i18n.js'

var fileUpload = multer({ dest: './tmp/' }).single('ocrphoto');

//Getting directory for easy path to html files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




const app = express()
//app.use(express.json())
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname + "/public")));
app.use(cookieParser());
app.use(i18nextMiddleware.handle(i18next, {
    removeLngFromUrl: false
}));



///////////////////////////////////////////////////

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

app.get("/changeToJa", async (req, res) => {
    res.cookie('i18next', 'ja')

    const myPage = req.t('index', { returnObjects: true, lng: 'ja' })
    res.render('index', { myPage: myPage })
})

app.get("/changeToEn", async (req, res) => {
    res.cookie('i18next', 'en')

    const myPage = req.t('index', { returnObjects: true, lng: 'en' })
    res.render('index', { myPage: myPage })
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get('/', (req, res) => {
    //req.i18n.resolvedLanguage = 'ja'
    console.log(req.i18n.resolvedLanguage)
    console.log(req.cookies.i18next)
    const myPage = req.t('index', { returnObjects: true, lng: req.cookies.i18next })
    res.render('index', { myPage: myPage })

})

app.get('/ocr', async (req, res) => {
    const myPage = req.t('ocr', { returnObjects: true, lng: req.cookies.i18next })
    const message = "Please upload a file"
    res.render('ocr', { myPage: myPage, message: message })
})

app.post('/ocr', async (req, res) => {
    const myPage = req.t('ocr', { returnObjects: true, lng: req.cookies.i18next })
    var img = req.body.imgBase64
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = Buffer.from(data, 'base64');
    try {
        fs.writeFileSync('./tmp/image.png', buf);
    } catch (err) {
        console.error(err);
    }
    let message = await getText('./tmp/image.png');
    console.log(message)
    //res.render('ocr', { myPage: myPage, message: message })
    res.json(message);

})

app.post('/ocrdrawing', async (req, res) => {
    const myPage = req.t('ocr', { returnObjects: true, lng: i18next.language })

    console.log(req.body.imgBase64)
    var img = req.body.imgBase64
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = Buffer.from(data, 'base64');
    try {
        fs.writeFileSync('./tmp/image.png', buf);
    } catch (err) {
        console.error(err);
    }
    let message = await getText('./tmp/image.png');
    console.log(message)
    res.render('ocr', { myPage: myPage, message: message })
})


app.listen(8080, () => {
    console.log("Server is running on port 8080")
})