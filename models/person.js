const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => {
        console.log("Connected to MongoDB")
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message)
    })

