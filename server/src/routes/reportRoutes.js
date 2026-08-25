const express = require('express');
const router = express.Router();
const {
  getReports,
  getReportById,
  createReport,
  resolveReport,
} = require('../controllers/reportController');

router.route('/')
  .get(getReports)
  .post(createReport);

router.route('/:id')
  .get(getReportById);

router.route('/:id/resolve')
  .patch(resolveReport);

module.exports = router;
