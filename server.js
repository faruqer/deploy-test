const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(fileUpload());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.uploadedFile;
    const uploadPath = path.join(__dirname, 'public', 'uploads', uploadedFile.name);

    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('File uploaded successfully!');
    });
});

app.listen(PORT, () => {
    console.log(`Server running`);
});