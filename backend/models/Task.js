const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Compound index for unique title per user (only for non-deleted tasks)
taskSchema.index({ title: 1, userId: 1, isDeleted: 1 }, { unique: false });

// Pre-save middleware for auto status logic
taskSchema.pre('save', function(next) {
  // Auto Status Logic: If priority is High, status defaults to "In Progress"
  if (this.isNew && this.priority === 'High' && !this._statusSetManually) {
    this.status = 'In Progress';
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema);
