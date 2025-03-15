const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now },
  reminderAt: Date,
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
