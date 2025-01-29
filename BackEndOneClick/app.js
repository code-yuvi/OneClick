const express = require('express')
const app = express();
const mongoose = require('mongoose')
app.use(express.json());
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require('path');
const router = express.Router();
const moment = require('moment');

const port = 3000;
const mongoURL = "mongodb+srv://yuvrajd568:deshmukh@cluster0.vovzp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

mongoose.connect(mongoURL).then(() => {
    console.log("Database connected")
}).catch((error) => {
    console.log(error);
})


require("./photographerDetails")
const photographer = mongoose.model('PhotographerInfo')


require("./userDetails")
const user = mongoose.model('UserInfo')


// const Booking = require("./Booking")
require("./Booking")
const Booking = mongoose.model('BookingInfo')

app.get('/', (req, res) => {
    res.send({ status: 'Started' })
})

app.post('/create-booking', async (req, res) => {

    const { userId, photographerId, date, time, location } = req.body;

    if (!userId || !photographerId || !date || !time || !location) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const bookingId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for the booking

        // Add booking to Photographer schema
        const photographerUpdate = await photographer.findByIdAndUpdate(
            photographerId,
            {
                $push: {
                    bookings: {
                        _id: bookingId, // Use the same bookingId
                        userId,
                        date,
                        time,
                        location,
                        status: 'pending',
                    }
                }
            },
            { new: true }
        );

        // Add booking to User schema
        const userUpdate = await user.findByIdAndUpdate(
            userId,
            {
                $push: {
                    bookings: {
                        _id: bookingId, // Use the same bookingId
                        photographerId,
                        date,
                        time,
                        location,
                        status: 'pending',
                    }
                }
            },
            { new: true }
        );

        if (!photographerUpdate || !userUpdate) {
            return res.status(404).json({ message: 'User or Photographer not found.' });
        }

        res.status(201).json({ message: 'Booking created successfully.' });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Error creating booking.' });
    }
});

app.get('/my-bookings', async (req, res) => {
    try {
        const { userId } = req.query; // Assuming you're passing the userId via query parameter

        const User = await user.findById(userId).populate('bookings.photographerId');  
        if (!User) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User bookings fetched successfully', data: User.bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user bookings' });
    }
});

app.get('/photo-bookings', async (req, res) => {
    try {
        const { photographerId } = req.query; // Assuming you're passing the userId via query parameter
        if (!photographerId) {
            return res.status(400).json({ message: 'Photographer ID is required' });
        }

        const Photographer = await photographer.findById(photographerId).populate('bookings.userId', 'name email');  
        
        if (!Photographer) {
            return res.status(404).json({ message: 'Photographer not found' });
        }

        res.status(200).json({ message: 'Photographer bookings fetched successfully', data: Photographer.bookings });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user bookings' });
    }
});

app.delete('/cancel-booking', async (req, res) => {
    try {
        const { userId, bookingId, photographerId } = req.body; // userId and bookingId to identify the booking to cancel

        const User = await user.findById(userId);
        const Photographer = await photographer.findById(photographerId);

        if (!User) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!Photographer) {
            return res.status(404).json({ message: 'Photographer not found' });
        }

        // Filter out the booking to cancel
        User.bookings = User.bookings.filter((booking) => booking._id.toString() !== bookingId);
        Photographer.bookings = Photographer.bookings.filter((booking) => booking._id.toString() !== bookingId);

        await User.save();
        await Photographer.save();

        res.status(200).json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error canceling booking' });
    }
});

// Photographer Booking

app.get('/photographer-bookings', async (req, res) => {
    try {
        const { photographerId } = req.query; // Get photographerId from the query

        // Find the photographer by photographerId
        const photographer = await mongoose.model('PhotographerInfo').findById(photographerId).populate('bookings.userId', 'name email'); // Populate user details for each booking

        if (!photographer) {
            return res.status(404).json({ message: 'Photographer not found' });
        }

        // Send the bookings data to the frontend
        res.status(200).json({ bookings: photographer.bookings });
    } catch (error) {
        console.error('Error fetching photographer bookings:', error);
        res.status(500).json({ message: 'Error fetching photographer bookings' });
    }
});


app.post('/update-booking-status', async (req, res) => {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
        return res.status(400).json({ message: 'Booking ID and status are required.' });
    }

    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    try {
        const session = await mongoose.startSession(); // Start a transaction
        session.startTransaction();

        // Find the booking in Photographer schema and update the status
        const photographerUpdate = await photographer.updateOne(
            { 'bookings._id': bookingId },
            { $set: { 'bookings.$.status': status } },
            { session }
        );

        // Find the booking in User schema and update the status
        const userUpdate = await user.updateOne(
            { 'bookings._id': bookingId },
            { $set: { 'bookings.$.status': status } },
            { session }
        );

        // Check if both updates were successful
        if (photographerUpdate.nModified === 0 || userUpdate.nModified === 0) {
            await session.abortTransaction(); // Abort the transaction on failure
            session.endSession();
            return res.status(404).json({ message: 'Booking not found in one or both schemas.' });
        }

        await session.commitTransaction(); // Commit the transaction on success
        session.endSession();

        res.status(200).json({ message: `Booking status updated to ${status} successfully.` });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ message: 'Error updating booking status.' });
    }
});


app.post("/registrePhotographer", async (req, res) => {
    const { name, lastName, email, password, contact, userType } = req.body;
    
    const olduser = await photographer.findOne({ email: email });
    
    
    if (olduser) {
        return res.send({ data: "User Already Exist!!" })
    }
    
    const encryptpass = await bcrypt.hash(password, 10);
    try {
        await photographer.create({
            name: name,
            lastName: lastName,
            email: email,
            contact: contact,
            password: encryptpass,
            userType: userType
            
        });
        res.send({ status: "ok", data: "Photographer Registered Successfully" })
    }
    catch (error) {
        res.send({ status: "error", data: error })
    }
});

app.post("/registreUser", async (req, res) => {
    const { name, lastName, email, password, contact, userType } = req.body;

    const olduser = await user.findOne({ email: email });
    if (olduser) {
        return res.send({ data: "User Already Exist!!" })
    }

    const encryptpass = await bcrypt.hash(password, 10);
    try {
        await user.create({
            name: name,
            lastName: lastName,
            email: email,
            contact: contact,
            password: encryptpass,
            userType: userType,
        });
        res.send({ status: "ok", data: "Registered Successfully" })
    }
    catch (error) {
        res.send({ status: "error", data: error })
    }
});


app.post("/loginPhotographer", async (req, res) => {
    const { email, password } = req.body;
    const olduser = await photographer.findOne({ email: email });
    if (!olduser) {
        return res.send({ data: "User dosen't exist!!" })
    }

    const isMatch = await bcrypt.compare(password, olduser.password);
    if (!isMatch) {
        return res.send({ data: "Invalid Password!!" })
    }
    if (isMatch) {
        const token = jwt.sign({ email: olduser.email }, JWT_SECRET);
        if (res.status(201)) {
            res.send({ status: "ok", data: token })
        } else {
            res.send({ status: "error", data: "Failed to login!!" })
        }
    }

})


app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;
    const olduser = await user.findOne({ email: email });

    if (!olduser) {
        return res.send({ data: "User dosen't exist!!" })
    }

    const isMatch = await bcrypt.compare(password, olduser.password);
    if (!isMatch) {
        return res.send({ data: "Invalid Password!!" })
    }
    if (isMatch) {
        const token = jwt.sign({ email: olduser.email }, JWT_SECRET);
        if (res.status(201)) {
            res.send({ status: "ok", data: token })
        } else {
            res.send({ status: "error", data: "Failed to login!!" })
        }
    }
})


app.post("/userdata", async (req, res) => {
    const { token } = req.body;
    try {
        const User = jwt.verify(token, JWT_SECRET);
        const useremail = User.email;

        user.findOne({ email: useremail }).then((data) => {
            return res.send({ status: "Ok", data: data });
        });
    } catch (error) {
        return res.send({ error: error });
    }
});

app.post("/photodata", async (req, res) => {
    const { token } = req.body;
    try {
        const User = jwt.verify(token, JWT_SECRET);
        const useremail = User.email;

        photographer.findOne({ email: useremail }).then((data) => {
            return res.send({ status: "Ok", data: data });
        });
    } catch (error) {
        return res.send({ error: error });
    }
});

app.post("/update-user", async (req, res) => {
    const { name, email, contact, image, lastName } = req.body;
    console.log(req.body);
    try {
        await user.updateOne(
            { email: email },
            {
                $set: {
                    name,
                    lastName,
                    contact,
                    image,
                    lastName,
                },
            }
        );
        res.send({ status: "Ok", data: "Updated" });
    } catch (error) {
        return res.send({ error: error });
    }
});

app.post("/update-photo", async (req, res) => {
    const { name, email, contact, image, lastName } = req.body;
    console.log(req.body);
    try {
        await photographer.updateOne(
            { email: email },
            {
                $set: {
                    name,
                    lastName,
                    contact,
                    image,
                    lastName,
                },
            }
        );
        res.send({ status: "Ok", data: "Updated" });
    } catch (error) {
        return res.send({ error: error });
    }
});

app.get("/get-user", async (req, res) => {
    try {
        const data = await photographer.find({});
        res.send({ status: "ok", data: data })
    }
    catch (error) {
        return res.send({ error: error })
    }
})
///////////////////////////////////////////////////


const imageSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    images: [
        {
            filename: String,
            url: String,
            uploadDate: { type: Date, default: Date.now }
        }
    ]
});

const Image = mongoose.model('Image', imageSchema);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Add timestamp to avoid duplicate file names
    }
});

const upload = multer({ storage: storage });

app.post('/uplode', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        //const email = req.body.email; // Get email from request body

        const newImage = {
            filename: req.file.filename,
            url: `http://192.168.1.36:3000/${req.file.filename}`, // Adjust the URL to serve uploaded files
            // email: email,
            uploadDate: new Date(),
        }

        await photographer.updateOne(
            { email: req.body.email }, // Use email to find the user
            { $push: { images: newImage } }, // Push new image into the images array
            { upsert: true } // Insert the document if it doesn't exist
        );

        // await newImage.save();

        res.json({
            message: 'File uploaded successfully',
            imageUrl: newImage.url,
            filename: newImage.filename,
        });

    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Server error');
    }
});


app.post('/get-images', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await photographer.findOne({ email: email });

        if (!user || !user.images) {
            return res.status(404).json({ message: 'No images found for this user.' });
        }

        // Send the images array back as the response
        res.json({ status: 'ok', images: user.images });
    } catch (error) {
        console.error('Error retrieving images:', error);
        res.status(500).json({ status: 'error', message: 'Server error while fetching images' });
    }
});

app.post('/delete-image', async (req, res) => {
    const { email, imageId } = req.body;
    try {
        await photographer.updateOne(
            { email: email },
            { $pull: { images: { _id: imageId } } }
        );
        res.json({ status: 'ok', message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ status: 'error', message: 'Server error while deleting image' });
    }
});



app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/get-all-photo', async (req, res) => {
    try {
        const data = await photographer.find({});
        res.send({ status: "Ok", data: data });
    }
    catch (error) {
        return res.send({ error: error });
    }
})

app.listen(port, () => {
    console.log('Node server Started')
})