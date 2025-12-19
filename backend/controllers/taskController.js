const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { title, description, status, priority } = req.body;

    // Check for duplicate title for the same user (excluding deleted tasks)
    const existingTask = await Task.findOne({
      title: title,
      userId: req.user.id,
      isDeleted: false
    });

    if (existingTask) {
      return res.status(400).json({
        success: false,
        message: 'You already have a task with this title'
      });
    }

    // Create task data
    const taskData = {
      title,
      description,
      priority: priority || 'Medium',
      userId: req.user.id
    };

    // Auto Status Logic: If priority is High, status defaults to "In Progress"
    if (priority === 'High') {
      taskData.status = 'In Progress';
    } else if (status) {
      taskData.status = status;
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { status, search, sortBy, order } = req.query;

    // Build query - only get non-deleted tasks for current user
    let query = {
      userId: req.user.id,
      isDeleted: false
    };

    // Filter by status
    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query.status = status;
    }

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Build sort object
    // Default: Priority order (High → Medium → Low), then latest first
    let sortOptions = {};
    
    // Custom priority sort mapping
    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };

    if (sortBy === 'priority') {
      // Will handle priority sorting after fetching
    } else if (sortBy === 'status') {
      sortOptions.status = order === 'asc' ? 1 : -1;
    } else if (sortBy === 'title') {
      sortOptions.title = order === 'asc' ? 1 : -1;
    } else {
      // Default sort: createdAt descending (latest first)
      sortOptions.createdAt = -1;
    }

    let tasks = await Task.find(query).sort(sortOptions);

    // Custom sort by priority if needed (High → Medium → Low, then by date)
    if (!sortBy || sortBy === 'priority') {
      tasks.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;
        // If same priority, sort by latest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task belongs to user (Authorization)
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let task = await Task.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task belongs to user (Authorization)
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to update this task'
      });
    }

    const { title, description, status, priority } = req.body;

    // Check for duplicate title if title is being updated
    if (title && title !== task.title) {
      const existingTask = await Task.findOne({
        title: title,
        userId: req.user.id,
        isDeleted: false,
        _id: { $ne: req.params.id }
      });

      if (existingTask) {
        return res.status(400).json({
          success: false,
          message: 'You already have a task with this title'
        });
      }
    }

    // Status Change Rule: Completed task cannot move back to Pending
    if (task.status === 'Completed' && status === 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Completed task cannot be moved back to Pending status'
      });
    }

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) {
      updateData.priority = priority;
      // Auto Status Logic on update: If priority changes to High and status is Pending
      if (priority === 'High' && task.status === 'Pending' && !status) {
        updateData.status = 'In Progress';
      }
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Soft delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    let task = await Task.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if task belongs to user (Authorization)
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to delete this task'
      });
    }

    // Soft delete - set isDeleted to true
    task = await Task.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
