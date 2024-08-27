const multer = require('multer')
const path = require('path')

// image storage engine multer middileware

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, callback) => {
        return callback(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({
    storage: storage
})

module.exports = upload