const mongoose = require('mongoose');
const Report = require('../models/Report');

// GET /api/reports?status=&category=&search=
const getReports = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ itemName: regex }, { description: regex }];
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};

// GET /api/reports/:id
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid report id' });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch report', error: error.message });
  }
};

// POST /api/reports
const createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);
    res.status(201).json(report);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create report', error: error.message });
  }
};

// PATCH /api/reports/:id/resolve
const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid report id' });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status: 'Resolved' },
      { new: true, runValidators: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to resolve report', error: error.message });
  }
};

module.exports = {
  getReports,
  getReportById,
  createReport,
  resolveReport,
};
