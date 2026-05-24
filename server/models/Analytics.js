const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  orgLogin: { type: String, required: true },
  repoName: { type: String },
  type: {
    type: String,
    enum: ['commits', 'prs', 'reviews', 'velocity', 'contributors', 'health'],
    required: true,
  },
  period: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
  data: { type: mongoose.Schema.Types.Mixed },
  cachedAt: { type: Date, default: Date.now, expires: 3600 }, // TTL 1 hour
});

analyticsSchema.index({ orgLogin: 1, type: 1, period: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
