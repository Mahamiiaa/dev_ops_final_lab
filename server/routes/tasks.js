const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// All task routes require authentication
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user with search, filter, sort, pagination
router.get('/', async (req, res) => {
  try {
    const { search, status, sortBy, order, page = 1, limit = 10 } = req.query;

    // Build query object - only get tasks for the authenticated user
    const query = { user: req.user._id };

    // Search by title (case-insensitive)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by status
    if (status && ['Pending', 'Completed'].includes(status)) {
      query.status = status;
    }

    // Build sort object
    let sortObj = { createdAt: -1 }; // default: newest first

    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      if (sortBy === 'dueDate') {
        sortObj = { dueDate: sortOrder, createdAt: -1 };
      } else if (sortBy === 'priority') {
        sortObj = { priorityValue: sortOrder, createdAt: -1 };
      }
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    // For priority sorting, we need aggregation
    let tasks;
    if (sortBy === 'priority') {
      tasks = await Task.aggregate([
        { $match: query },
        {
          $addFields: {
            priorityValue: {
              $switch: {
                branches: [
                  { case: { $eq: ['$priority', 'High'] }, then: 3 },
                  { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                  { case: { $eq: ['$priority', 'Low'] }, then: 1 },
                ],
                default: 0,
              },
            },
          },
        },
        { $sort: sortObj },
        { $skip: skip },
        { $limit: limitNum },
      ]);
    } else {
      tasks = await Task.find(query).sort(sortObj).skip(skip).limit(limitNum);
    }

    res.json({
      tasks,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post(
  '/',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Priority must be Low, Medium, or High'),
    body('status')
      .optional()
      .isIn(['Pending', 'Completed'])
      .withMessage('Status must be Pending or Completed'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { title, description, dueDate, priority, status } = req.body;

    try {
      const task = await Task.create({
        user: req.user._id,
        title,
        description,
        dueDate,
        priority,
        status,
      });

      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   GET /api/tasks/stats
// @desc    Get task statistics for the logged-in user
router.get('/stats', async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user._id });
    const completed = await Task.countDocuments({
      user: req.user._id,
      status: 'Completed',
    });
    const pending = await Task.countDocuments({
      user: req.user._id,
      status: 'Pending',
    });

    res.json({ total, completed, pending });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .not()
      .isEmpty()
      .withMessage('Title cannot be empty'),
    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Priority must be Low, Medium, or High'),
    body('status')
      .optional()
      .isIn(['Pending', 'Completed'])
      .withMessage('Status must be Pending or Completed'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    try {
      let task = await Task.findOne({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const { title, description, dueDate, priority, status } = req.body;

      task.title = title ?? task.title;
      task.description = description ?? task.description;
      task.dueDate = dueDate ?? task.dueDate;
      task.priority = priority ?? task.priority;
      task.status = status ?? task.status;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PATCH /api/tasks/:id/status
// @desc    Toggle task status (completed/pending)
router.patch('/:id/status', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
