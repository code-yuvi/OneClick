// const mongoose = require("mongoose")
// // const bcrypt = require("bcrypt")

// const registrePhotographerSchema = new mongoose.Schema({
//     name: String,
//     lastName: String,
//     contact: String,
//     email: { type: String, unique: true },
//     password: String,
//     image: String,
//     images: [
//         {
//             filename: String,
//             url: String,
//             uploadDate: { type: Date, default: Date.now }
//         }
//     ],
//     userType: {type: String, default: 'photographer'}
// }, {
//     collection: "PhotographerInfo"
// }); 
// mongoose.model("PhotographerInfo", registrePhotographerSchema)


const mongoose = require("mongoose");

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
    userType: { type: String, default: 'photographer' },
    bookings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true }, // Reference to the User schema
            date: { type: String, required: true }, // Booking date
            time: { type: String, required: true }, // Booking time
            location: { type: String, required: true }, // Booking location
            status: { type: String, default: 'pending' }, // Booking status (e.g., pending, confirmed, canceled)
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, {
    collection: "PhotographerInfo"
});

mongoose.model("PhotographerInfo", registrePhotographerSchema);
