const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const chrono = require('chrono-node');
const schedule = require('node-schedule');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// ✅ Connect to MongoDB Cluster
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Connection Error:', err));

/* ------------------------ NOTES FUNCTIONALITY (notesDB) ------------------------ */
const NoteSchema = new mongoose.Schema({
    text: String,
    reminderAt: Date,
    createdAt: { type: Date, default: Date.now }
});
const notesDB = mongoose.connection.useDb("notesDB");
const Note = notesDB.model('Note', NoteSchema);

app.post('/add-note', async (req, res) => {
    const { text } = req.body;
    let parsedDate = chrono.parseDate(text);
    
    if (!parsedDate) {
        const timeMatch = text.match(/\d{1,2}:\d{2}\s?(AM|PM)?/i);
        if (timeMatch) {
            parsedDate = new Date();
            const [hours, minutes] = timeMatch[0].split(':');
            parsedDate.setHours(parseInt(hours), parseInt(minutes), 0);
        }
    }
    
    const newNote = new Note({ text, reminderAt: parsedDate || null });
    try {
        await newNote.save();
        res.status(201).json(newNote);
        if (parsedDate) {
            schedule.scheduleJob(parsedDate, () => {
                console.log(`⏰ ALERT: Time to check your note: "${newNote.text}"`);
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to save note' });
    }
});

app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching notes' });
    }
});

/* --------------------- ACTIVITY MONITORING (yes/no) --------------------- */
const ActivitySchema = new mongoose.Schema({
    response: String,  // "Yes", "No", or "Other"
    date: { type: Date, default: Date.now }
});
const Activitymonitoring = mongoose.model('Activitymonitoring', ActivitySchema);

app.post('/api/activity', async (req, res) => {
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

app.get('/api/activity', async (req, res) => {
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
    createdAt: { type: Date, default: Date.now }
});
const takecareDB = mongoose.connection.useDb("takecareDB");
const HealthRecord = takecareDB.model('HealthRecord', HealthRecordSchema);

app.post('/add-health-record', async (req, res) => {
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
        res.status(201).json({ message: 'Health record saved successfully', record: newRecord });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save health record' });
    }
});

app.get('/health-records', async (req, res) => {
    try {
        const records = await HealthRecord.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching health records', error });
    }
});

/* ------------------------ SERVER START ------------------------ */
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));