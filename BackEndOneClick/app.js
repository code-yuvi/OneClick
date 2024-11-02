const express = require('express')
const app = express();
const mongoose = require('mongoose')
app.use(express.json());
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const multer = require('multer');
const path = require('path');
const router = express.Router();

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



app.get('/', (req, res) => {
    res.send({ status: 'Started' })
})


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



app.listen(port, () => {
    console.log('Node server Started')
})