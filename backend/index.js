const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const chrono = require("chrono-node");
const schedule = require("node-schedule");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const multer = require("multer");
const Tesseract = require("tesseract.js");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");


const app = express(); 
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:8081", 
  credentials: true
}));

app.use(bodyParser.json());

// Create the uploads directory if it doesn't exist
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

//  Connect to MongoDB Cluster
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" MongoDB Connection Error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['caretaker', 'patient'],
    default: 'patient'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", UserSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

// Authentication Routes
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Validate role
    if (!['caretaker', 'patient'].includes(role)) {
      return res.status(400).json({ error: "Invalid role. Must be either 'caretaker' or 'patient'" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token with role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// --------------------- IMAGE TEXT EXTRACTION (OCR FUNCTIONALITY) ---------------------

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use original filename
  },
});

const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imagePath = path.resolve(req.file.path); // Get absolute path

  // Use Tesseract.js for OCR processing
  Tesseract.recognize(imagePath, "eng", { logger: (m) => console.log(m) })
    .then(({ data: { text } }) => {
      console.log("OCR Text: ", text);

      // After OCR processing, use Python to process further with the model
      processWithModel(imagePath, text, res);
    })
    .catch((error) => {
      console.error("OCR Error:", error);
      res.status(500).json({ error: "Failed to extract text from image" });
    });
});

// Function to call Python script
function processWithModel(imagePath, ocrText, res) {
  const command = `
        call pythonEnv\\Scripts\\activate &&
        python inference.py "${imagePath}"
    `;

  exec(command, { shell: "cmd.exe" }, (error, stdout, stderr) => {
    if (error) {
      console.error("Python Script Error:", error);
      return res
        .status(500)
        .json({ error: "Failed to process image with the model" });
    }

    console.log("Python Output:", stdout);
    res.json({ ocrText, modelOutput: stdout.trim() });
  });
}

/* ------------------------ NOTES FUNCTIONALITY (notesDB) ------------------------ */
const NoteSchema = new mongoose.Schema({
  text: String,
  reminderAt: Date,
  createdAt: { type: Date, default: Date.now },
});
const notesDB = mongoose.connection.useDb("notesDB");
const Note = notesDB.model("Note", NoteSchema);

app.post("/add-note", async (req, res) => {
  const { text } = req.body;
  let parsedDate = chrono.parseDate(text);

  if (!parsedDate) {
    const timeMatch = text.match(/\d{1,2}:\d{2}\s?(AM|PM)?/i);
    if (timeMatch) {
      parsedDate = new Date();
      const [hours, minutes] = timeMatch[0].split(":");
      parsedDate.setHours(parseInt(hours), parseInt(minutes), 0);
    }
  }

  const newNote = new Note({ text, reminderAt: parsedDate || null });
  try {
    await newNote.save();
    res.status(201).json(newNote);
    if (parsedDate) {
      schedule.scheduleJob(parsedDate, () => {
        console.log(` ALERT: Time to check your note: "${newNote.text}"`);
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save note" });
  }
});

app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: "Error fetching notes" });
  }
});

/* --------------------- ACTIVITY MONITORING (yes/no) --------------------- */
const ActivitySchema = new mongoose.Schema({
  response: String, // "Yes", "No", or "Other"
  date: { type: Date, default: Date.now },
});
const Activitymonitoring = mongoose.model("Activitymonitoring", ActivitySchema);

app.post("/api/activity", async (req, res) => {
  const { response } = req.body;
  if (!response) {
    return res.status(400).json({ message: "Response is required" });
  }
  try {
    const newEntry = new Activitymonitoring({ response });
    const savedEntry = await newEntry.save();
    res.json(savedEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/activity", async (req, res) => {
  try {
    const records = await Activitymonitoring.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* --------------------- HEALTH RECORD FUNCTIONALITY (takecareDB) -------------------- */
const HealthRecordSchema = new mongoose.Schema({
  userId: String,
  diseaseHistory: String,
  yearsSuffering: Number,
  symptoms: String,
  allergies: String,
  lifestyle: String,
  smokingDrinking: String,
  physicalActivity: String,
  diet: String,
  prescription: String,
  doctorReport: String,
  createdAt: { type: Date, default: Date.now },
});
const takecareDB = mongoose.connection.useDb("takecareDB");
const HealthRecord = takecareDB.model("HealthRecord", HealthRecordSchema);

app.post("/add-health-record", async (req, res) => {
  const { userId, formData, imageData } = req.body;
  try {
    const newRecord = new HealthRecord({
      userId,
      diseaseHistory: formData.diseaseHistory,
      yearsSuffering: formData.yearsSuffering,
      symptoms: formData.symptoms,
      allergies: formData.allergies,
      lifestyle: formData.lifestyle,
      smokingDrinking: formData.smokingDrinking,
      physicalActivity: formData.physicalActivity,
      diet: formData.diet,
      prescription: imageData.prescription,
      doctorReport: imageData.doctorReport,
    });

    await newRecord.save();
    res
      .status(201)
      .json({ message: "Health record saved successfully", record: newRecord });
  } catch (error) {
    res.status(500).json({ error: "Failed to save health record" });
  }
});

app.get("/health-records", async (req, res) => {
  try {
    const records = await HealthRecord.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ message: "Error fetching health records", error });
  }
});

app.post("/generate-speech", (req, res) => {
  const { text } = req.body;

  // Path to your Python script that will use the model
  const pythonProcess = spawn(
    "python",
    [
      "tts_wrapper.py", // You'll need to create this script
      text,
    ],
    { cwd: "./path/to/your/model" }
  ); // Path to your model directory

  const chunks = [];

  pythonProcess.stdout.on("data", (data) => {
    chunks.push(data);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).send("Error generating speech");
    }

    // Assuming the Python script outputs the path to the generated audio file
    const audioFilePath = Buffer.concat(chunks).toString().trim();
    res.sendFile(audioFilePath);
  });
});

/* ------------------------ SERVER START ------------------------ */
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
