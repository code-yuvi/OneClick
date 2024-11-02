const mongoose = require("mongoose")
// const bcrypt = require("bcrypt")

const registrePhotographerSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    contact: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    images: [
        {
            filename: String,
            url: String,
            uploadDate: { type: Date, default: Date.now }
        }
    ],
    userType: {type: String, default: 'photographer'}
}, {
    collection: "PhotographerInfo"
}); 
mongoose.model("PhotographerInfo", registrePhotographerSchema)