const Contract = require('../models/Contract');
const Client = require('../models/Client');

const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Contract counts by status
    const statusCounts = await Contract.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, totalValue: { $sum: '$value' } } }
    ]);

    // Total counts
    const totalContracts = await Contract.countDocuments();
    const totalClients = await Client.countDocuments();
    const activeContracts = await Contract.countDocuments({ status: 'active' });
    const expiredContracts = await Contract.countDocuments({ status: 'expired' });

    // Expiring soon
    const expiringSoon = await Contract.countDocuments({
      status: 'active',
      endDate: { $gte: now, $lte: thirtyDaysLater }
    });

    // Total contract value
    const valueResult = await Contract.aggregate([
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]);
    const totalValue = valueResult[0]?.total || 0;

    // Monthly new contracts (last 6 months)
    const monthlyData = await Contract.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 }, value: { $sum: '$value' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Contract by type
    const typeData = await Contract.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Recent contracts
    const recentContracts = await Contract.find()
      .populate('client', 'name company')
      .sort({ createdAt: -1 })
      .limit(5);

    // Expiring contracts
    const expiringContracts = await Contract.find({
      status: 'active',
      endDate: { $gte: now, $lte: thirtyDaysLater }
    }).populate('client', 'name company').sort({ endDate: 1 }).limit(5);

    res.json({
      stats: { totalContracts, totalClients, activeContracts, expiredContracts, expiringSoon, totalValue },
      statusCounts,
      monthlyData,
      typeData,
      recentContracts,
      expiringContracts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
