const express = require('express');
const router = express.Router();
const { initializeDatabase } = require('../controllers/transactionController');

router.get('/initialize', initializeDatabase);

const { getTransactionStatistics } = require('../controllers/transactionController');

router.get('/statistics', getTransactionStatistics);

const { getStatistics } = require('../controllers/transactionController');

router.get('/statistics', getStatistics);

const { getBarChartData } = require('../controllers/transactionController');

router.get('/bar-chart', getBarChartData);

const { getPieChartData } = require('../controllers/transactionController');

router.get('/pie-chart', getPieChartData);

const { getCombinedData } = require('../controllers/transactionController');

router.get('/combined', getCombinedData);

module.exports = router;