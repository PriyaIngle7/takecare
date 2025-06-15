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
const axios = require('axios');

// 8EX65W

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
  .connect("mongodb+srv://Priya:Priya7@cluster0.aklih.mongodb.net/Takecare", {
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
  inviteCode: {
    type: String,
    unique: true
  },
  caretakerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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
app.get("/", (req, res) => {
  res.status(201).json({ message: "Chalra hua na mei bsdk" });
})
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


// Patient Signup Route
app.post("/api/patient/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a random 6-character invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const patient = new User({
      email,
      password: hashedPassword,
      name,
      role: "patient",
      inviteCode // Add the invite code during creation
    });

    await patient.save();

    // Generate token
    const token = jwt.sign({ id: patient._id, role: patient.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({ 
      message: "Patient registered successfully", 
      patient,
      token,
      inviteCode // Send the invite code back to the client
    });
  } catch (error) {
    console.error("Error in patient signup:", error);
    res.status(500).json({ error: "Failed to register patient" });
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
// app.post("/upload-image", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   const imagePath = path.resolve(req.file.path);

//   // Step 1: OCR
//   Tesseract.recognize(imagePath, "eng", { logger: (m) => console.log(m) })
//     .then(async ({ data: { text } }) => {
//       console.log("OCR Text:", text);

//       // Step 2: Call Flask for model inference
//       try {
//         const flaskResponse = await axios.post("http://localhost:5001/infer", {
//           imagePath: imagePath,
//           ocrText: text,
//         });

//         res.json({
//           ocrText: text,
//           modelOutput: flaskResponse.data.modelOutput,
//         });
//       } catch (error) {
//         console.error("Error calling Flask API:", error.message);
//         res.status(500).json({ error: "Failed to process image with model" });
//       }
//     })
//     .catch((error) => {
//       console.error("OCR Error:", error);
//       res.status(500).json({ error: "Failed to extract text from image" });
//     });
// });

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

/* --------------------- MEDICINE INTAKE MONITORING --------------------- */
const MedicineIntakeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  response: {
    type: String,
    enum: ['Yes', 'No'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: ''
  }
});

const MedicineIntake = mongoose.model('MedicineIntake', MedicineIntakeSchema);

// Get medicine intake history
app.get("/api/medicine-intake/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await MedicineIntake.find({ userId })
      .sort({ date: -1 })
      .limit(30); // Get last 30 records
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new medicine intake record
app.post("/api/medicine-intake", async (req, res) => {
  try {
    const { userId, response, notes } = req.body;
    if (!userId || !response) {
      return res.status(400).json({ message: "userId and response are required" });
    }

    const newRecord = new MedicineIntake({
      userId,
      response,
      notes: notes || ''
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get medicine intake statistics
app.get("/api/medicine-intake/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await MedicineIntake.find({ userId });

    const total = records.length;
    const taken = records.filter(r => r.response === 'Yes').length;
    const missed = records.filter(r => r.response === 'No').length;
    const complianceRate = total > 0 ? (taken / total) * 100 : 0;

    res.json({
      total,
      taken,
      missed,
      complianceRate: Math.round(complianceRate)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate invite code for patient
app.post("/api/patient/generate-invite", auth, async (req, res) => {
  try {
    if (req.user.role !== 'patient') {
      return res.status(403).json({ error: "Only patients can generate invite codes" });
    }

    // Generate a random 6-character invite code
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Update user with invite code
    req.user.inviteCode = inviteCode;
    await req.user.save();

    res.json({ inviteCode });
  } catch (error) {
    console.error("Error generating invite code:", error);
    res.status(500).json({ error: "Failed to generate invite code" });
  }
});

// Validate patient invite code and link caretaker
app.post("/api/caretaker/validate-invite", auth, async (req, res) => {
  try {
    if (req.user.role !== 'caretaker') {
      return res.status(403).json({ error: "Only caretakers can validate invite codes" });
    }

    const { inviteCode } = req.body;
    const patient = await User.findOne({ inviteCode, role: 'patient' });

    if (!patient) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    // Link patient to caretaker
    patient.caretakerId = req.user._id;
    await patient.save();

    // Add patient to caretaker's patients list
    req.user.patients.push(patient._id);
    await req.user.save();

    res.json({ message: "Successfully linked with patient", patient });
  } catch (error) {
    console.error("Error validating invite code:", error);
    res.status(500).json({ error: "Failed to validate invite code" });
  }
});

// Get caretaker's patients
app.get("/api/caretaker/patients", auth, async (req, res) => {
  try {
    if (req.user.role !== 'caretaker') {
      return res.status(403).json({ error: "Only caretakers can access this endpoint" });
    }

    const patients = await User.find({ caretakerId: req.user._id });
    res.json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

/* ------------------------ SERVER START ------------------------ */
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
