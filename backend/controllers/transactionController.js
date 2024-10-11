const axios = require('axios');
const Transaction = require('../models/Transaction');

exports.initializeDatabase = async (req, res) => {
  try {
    const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.insertMany(data);
    res.status(201).json({ message: 'Database initialized' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize database' });
  }
};

// controllers/transactionController.js

exports.getTransactionStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    // Assuming you have a Transaction model
    const transactions = await Transaction.find({
      dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } // Filter by month
    });

    const totalAmount = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalSoldItems = transactions.length; // Assuming each document represents a sold item
    const totalNotSoldItems = await Transaction.countDocuments({ sold: false }); // Adjust according to your schema

    res.json({
      totalAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error('Error fetching transaction statistics:', error);
    res.status(500).json({ error: 'An error occurred while fetching transaction statistics.' });
  }
};

  
  exports.getStatistics = async (req, res) => {
    try {
      const { month } = req.query;
      const query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } };
  
      const totalSaleAmount = await Transaction.aggregate([
        { $match: query },
        { $group: { _id: null, totalSale: { $sum: '$price' } } }
      ]);
  
      const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });
      const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });
  
      res.json({
        totalSaleAmount: totalSaleAmount[0]?.totalSale || 0,
        totalSoldItems,
        totalNotSoldItems,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  };
exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;

    // Mock data for the bar chart
    const barChartData = [
      { range: '0-100', count: Math.floor(Math.random() * 50) },
      { range: '101-200', count: Math.floor(Math.random() * 50) },
      { range: '201-300', count: Math.floor(Math.random() * 50) },
      { range: '301-400', count: Math.floor(Math.random() * 50) },
      { range: '401-500', count: Math.floor(Math.random() * 50) },
    ];

    res.json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    res.status(500).json({ error: 'An error occurred while fetching bar chart data.' });
  }
};

exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const query = { dateOfSale: { $regex: `-${month.padStart(2, '0')}-` } };

    const categoriesData = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } }
    ]);

    res.json(categoriesData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ error: 'An error occurred while fetching pie chart data.' });
  }
};

  exports.getCombinedData = async (req, res) => {
    try {
      const { month } = req.query;
  
      const statisticsPromise = TransactionController.getStatistics(req, res);
      const barChartPromise = TransactionController.getBarChartData(req, res);
      const pieChartPromise = TransactionController.getPieChartData(req, res);
  
      const [statistics, barChart, pieChart] = await Promise.all([statisticsPromise, barChartPromise, pieChartPromise]);
  
      res.json({
        statistics,
        barChart,
        pieChart
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch combined data' });
    }
  };
  