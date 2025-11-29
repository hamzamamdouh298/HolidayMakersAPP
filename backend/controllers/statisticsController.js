const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Role = require('../models/Role');

/**
 * Get general statistics
 */
exports.getGeneralStatistics = async (req, res) => {
  try {
    // Get date range from query params (default to last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // Total reservations
    const totalReservations = await Reservation.countDocuments({ isDeleted: false });
    
    // Active reservations (not cancelled or completed)
    const activeReservations = await Reservation.countDocuments({ 
      isDeleted: false,
      progress: { $in: ['Pending', 'In Progress'] }
    });

    // Reservations by status
    const reservationsByStatus = await Reservation.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$progress', count: { $sum: 1 } } }
    ]);

    // Reservations by confirm status
    const reservationsByConfirmStatus = await Reservation.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$confirmStatus', count: { $sum: 1 } } }
    ]);

    // Reservations by type
    const reservationsByType = await Reservation.aggregate([
      { $match: { isDeleted: false, type: { $ne: '' } } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Reservations by currency
    const reservationsByCurrency = await Reservation.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$currency', count: { $sum: 1 } } }
    ]);

    // Reservations by branch
    const reservationsByBranch = await Reservation.aggregate([
      { $match: { isDeleted: false, branch: { $ne: '' } } },
      { $group: { _id: '$branch', count: { $sum: 1 } } }
    ]);

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrends = await Reservation.aggregate([
      { 
        $match: { 
          isDeleted: false,
          createdAt: { $gte: sixMonthsAgo }
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Recent reservations
    const recentReservations = await Reservation.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'fullName username')
      .select('fileNumber client date amount progress confirmStatus');

    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Users by department
    const usersByDepartment = await User.aggregate([
      { $match: { department: { $ne: '' } } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Users by branch
    const usersByBranch = await User.aggregate([
      { $match: { branch: { $ne: '' } } },
      { $group: { _id: '$branch', count: { $sum: 1 } } }
    ]);

    // Top performers (users with most reservations)
    const topPerformers = await Reservation.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$user', reservationCount: { $sum: 1 } } },
      { $sort: { reservationCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 1,
          reservationCount: 1,
          fullName: '$userDetails.fullName',
          username: '$userDetails.username',
          branch: '$userDetails.branch'
        }
      }
    ]);

    // Total amount calculation (simplified - treating all as numbers)
    const amountStats = await Reservation.aggregate([
      { $match: { isDeleted: false, amount: { $ne: '' } } },
      {
        $group: {
          _id: '$currency',
          total: { $sum: { $toDouble: { $ifNull: ['$amount', '0'] } } }
        }
      }
    ]);

    // Destinations statistics
    const topDestinations = await Reservation.aggregate([
      { $match: { isDeleted: false, destination: { $ne: '' } } },
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          totalReservations,
          activeReservations,
          totalUsers,
          activeUsers
        },
        reservations: {
          byStatus: reservationsByStatus,
          byConfirmStatus: reservationsByConfirmStatus,
          byType: reservationsByType,
          byCurrency: reservationsByCurrency,
          byBranch: reservationsByBranch
        },
        trends: {
          monthly: monthlyTrends
        },
        recent: recentReservations,
        users: {
          byDepartment: usersByDepartment,
          byBranch: usersByBranch,
          topPerformers
        },
        financial: {
          totalsByCurrency: amountStats
        },
        destinations: topDestinations
      }
    });

  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get statistics',
      error: error.message
    });
  }
};

/**
 * Get reservation statistics with date range
 */
exports.getReservationStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const matchFilter = { isDeleted: false };
    if (Object.keys(dateFilter).length > 0) {
      matchFilter.createdAt = dateFilter;
    }

    // Get statistics for the date range
    const totalCount = await Reservation.countDocuments(matchFilter);
    
    const statusBreakdown = await Reservation.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$progress', count: { $sum: 1 } } }
    ]);

    const typeBreakdown = await Reservation.aggregate([
      { $match: { ...matchFilter, type: { $ne: '' } } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalCount,
        statusBreakdown,
        typeBreakdown
      }
    });

  } catch (error) {
    console.error('Error getting reservation statistics:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get reservation statistics',
      error: error.message
    });
  }
};

/**
 * Get user performance statistics
 */
exports.getUserPerformance = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;

    // User's reservation count
    const reservationCount = await Reservation.countDocuments({ 
      user: userId,
      isDeleted: false 
    });

    // Reservations by status
    const reservationsByStatus = await Reservation.aggregate([
      { $match: { user: userId, isDeleted: false } },
      { $group: { _id: '$progress', count: { $sum: 1 } } }
    ]);

    // Recent activity
    const recentActivity = await Reservation.find({ 
      user: userId,
      isDeleted: false 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('fileNumber client date amount progress');

    res.status(200).json({
      status: 'success',
      data: {
        reservationCount,
        reservationsByStatus,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Error getting user performance:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user performance',
      error: error.message
    });
  }
};

