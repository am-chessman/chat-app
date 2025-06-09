import express from 'express';
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
// import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const app = express();
const __dirname = path.dirname(__filename);

dotenv.config();
app.set('view engine', 'ejs');
app.use(express.static( "public"))
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
    limits: {fileSize: 1024 * 1024 * 1024},
}))

app.get('/', (req   , res) => {
    res.render("index.ejs");
})

app.post('/upload', (req, res) => {
    let file;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    file = req.files.file;
    uploadPath = __dirname + '/uploads/' + file.name;

    // Use the mv() method to place the file somewhere on your server
    file.mv(uploadPath, function(err) {
        if ( err )
            console.error("Error", err)
        else {
            res.render('index.ejs', {response: '../photo.png'});
        }
    })
})

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + process.env.PORT || 3000);
})