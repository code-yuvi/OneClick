const mongoose = require("mongoose")
// const bcrypt = require("bcrypt")

const registreUserSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    contact: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    userType: {type: String, default: 'user'},
    bookings: [{
        photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhotographerInfo', required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        location: { type: String, required: true },
        status: { type: String, default: 'pending' }, // Optionally track booking status
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    collection: "UserInfo"
});
mongoose.model("UserInfo", registreUserSchema)