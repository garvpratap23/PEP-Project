const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  name: { type: String },
  description: { type: String },
  avatarUrl: { type: String },
  publicRepos: { type: Number, default: 0 },
  repositories: [
    {
      id: Number,
      name: String,
      fullName: String,
      description: String,
      language: String,
      stars: Number,
      forks: Number,
      openIssues: Number,
      isPrivate: Boolean,
      updatedAt: Date,
    },
  ],
  lastSynced: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Organization', organizationSchema);
