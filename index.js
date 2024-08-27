const port = 4001
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const upload = require('./middileware/multerMiddileware')
const router=require('./Router/router')

app.use(cors())
app.use(express.json())
app.use(router)

mongoose.connect("mongodb+srv://abhishekohmz1234:AJAYAKUMAR1234@cluster0.rkomeqt.mongodb.net/fresh-home")

app.get('/', (req, res) => {
    res.send('express app is running')
})


// creating upload endpoint for images
app.use('/images', express.static('upload/images'))
app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `${req.file.filename}`
    })
})

app.listen(port, (error) => {
    if (!error) {
        console.log("server running on port", port);
    } else {
        console.log("error:", error);
    }
})