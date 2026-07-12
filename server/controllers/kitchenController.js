// server/controllers/kitchenController.js
const db = require('../db');
const { getCurrentMealWindow } = require('./scanController');

async function getKitchenMetrics(req, res) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Determine active meal window or default to MORNING for dashboard visualization
    const activeWindow = getCurrentMealWindow() || 'AFTERNOON';

    // 1. Fetch running sum totals of active unique scans for hostels
    const headcountRaw = await db.getLiveMessHeadcount(activeWindow, todayStr);
    
    // Convert array response to map
    const headcountMap = { M1: 0, M2: 0, M3: 0 };
    headcountRaw.forEach(item => {
      if (headcountMap[item.hostel_id] !== undefined) {
        headcountMap[item.hostel_id] = parseInt(item.portion_count, 10);
      }
    });

    const totalPortions = headcountMap.M1 + headcountMap.M2 + headcountMap.M3;

    // 2. Fetch central kitchen assets and calculate alert thresholds
    const assetsRaw = await db.getKitchenAssets();
    const assetsWithAlerts = assetsRaw.map(asset => {
      const stock = parseFloat(asset.stock_quantity_kg);
      const threshold = parseFloat(asset.alert_threshold_kg);
      return {
        asset_id: asset.asset_id,
        ingredient_name: asset.ingredient_name,
        stock_quantity_kg: stock,
        alert_threshold_kg: threshold,
        low_stock_alert: stock < threshold
      };
    });

    return res.status(200).json({
      status: 'SUCCESS',
      data: {
        active_meal_window: activeWindow,
        date: todayStr,
        headcount: {
          M1: headcountMap.M1,
          M2: headcountMap.M2,
          M3: headcountMap.M3,
          total: totalPortions
        },
        inventory: assetsWithAlerts
      }
    });
  } catch (err) {
    console.error('Kitchen metrics error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error fetching kitchen metrics' });
  }
}

// Controller to update ingredient stocks (Global Admin right)
async function updateAssetStock(req, res) {
  try {
    const { ingredient_name, stock_quantity_kg } = req.body;
    if (!ingredient_name || stock_quantity_kg === undefined) {
      return res.status(400).json({ status: 'ERROR', message: 'Ingredient name and stock quantity are required' });
    }

    const updated = await db.updateKitchenAssetStock(ingredient_name, stock_quantity_kg);
    if (!updated) {
      return res.status(404).json({ status: 'ERROR', message: `Ingredient '${ingredient_name}' not found.` });
    }

    return res.status(200).json({
      status: 'SUCCESS',
      message: `Stock for '${ingredient_name}' updated successfully to ${stock_quantity_kg} kg.`,
      asset: updated
    });
  } catch (err) {
    console.error('Update kitchen asset error:', err);
    return res.status(500).json({ status: 'ERROR', message: 'Internal Server Error updating inventory' });
  }
}

module.exports = {
  getKitchenMetrics,
  updateAssetStock
};
