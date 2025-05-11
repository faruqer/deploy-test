const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(fileUpload());
app.use(express.static('public'));

// Create uploads directory (works for both local and Render)
const uploadDir = path.join(__dirname, 'public', 'uploads');

// Ensure directory exists (create if it doesn't)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory at ${uploadDir}`);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.uploadedFile;
    
    // Sanitize filename
    const sanitizedFilename = uploadedFile.name.replace(/[^a-zA-Z0-9\._-]/g, '');
    const uploadPath = path.join(uploadDir, sanitizedFilename);

    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(500).send('Error saving file');
        }
        res.send(`File uploaded successfully! Saved as ${sanitizedFilename}`);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Uploads directory: ${uploadDir}`);
});
