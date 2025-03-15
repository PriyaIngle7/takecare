const mongoose = require('mongoose');

const HealthRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  diseaseHistory: String,
  yearsSuffering: String,
  symptoms: String,
  allergies: String,
  lifestyle: String,
  smokingDrinking: String,
  physicalActivity: String,
  diet: String,
  prescription: String, // Store as file URL
  doctorReport: String, // Store as file URL
});

const takecareDB = mongoose.connection.useDb("takecareDB");
module.exports = takecareDB.model('HealthRecord', HealthRecordSchema);
