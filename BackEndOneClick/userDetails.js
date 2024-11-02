const mongoose = require("mongoose")
// const bcrypt = require("bcrypt")

const registreUserSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    contact: String,
    email: { type: String, unique: true },
    password: String,
    image: String,
    userType: {type: String, default: 'user'}
}, {
    collection: "UserInfo"
});
mongoose.model("UserInfo", registreUserSchema)