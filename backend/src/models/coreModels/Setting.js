const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

  settingCategory: {
    type: String,
    required: true,
    lowercase: true,
  },
  settingKey: {
    type: String,
    lowercase: true,
    required: true,
  },
  settingValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  valueType: {
    type: String,
    default: 'String',
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  isCoreSetting: {
    type: Boolean,
    default: false,
  },
});

// Add unique index to prevent duplicate settings
settingSchema.index(
  { settingCategory: 1, settingKey: 1, removed: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { removed: false },
    name: 'unique_active_setting'
  }
);

module.exports = mongoose.model('Setting', settingSchema);
