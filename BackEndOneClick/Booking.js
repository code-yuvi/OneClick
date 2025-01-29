const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'PhotographerInfo', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserInfo', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, default: 'pending' }, // Optionally track booking status
    createdAt: { type: Date, default: Date.now }
},{
    collection: "BookingInfo"
});

module.exports = mongoose.model('BookingInfo', bookingSchema);