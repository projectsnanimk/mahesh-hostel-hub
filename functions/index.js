const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const XLSX = require("xlsx");

admin.initializeApp();

exports.dailyStockArchive = onSchedule({
  schedule: "0 21 * * *",
  timeZone: "Asia/Kolkata",
  region: "us-central1"
}, async (event) => {
  try {
    const db = admin.firestore();
    
    // 1. Download active ingredients state dataset array
    logger.info("Initializing connection to Firestore ingredients collection...");
    const snapshot = await db.collection("ingredients").orderBy("ingredient_name").get();
    const ingredients = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const opening = parseFloat(data.opening_stock) || 0;
      const inward = parseFloat(data.today_inward) || 0;
      const issued = parseFloat(data.today_issued) || 0;
      const available = opening + inward - issued;
      
      ingredients.push({
        "Ingredient Name": data.ingredient_name || "",
        "Opening Stock (KG/Ltr)": opening,
        "Today Inward (In)": inward,
        "Today Issued (Out)": issued,
        "Current Available Stock": available,
        "Minimum Threshold (KG/Ltr)": parseFloat(data.minimum_threshold) || 0,
        "Total Capacity (KG/Ltr)": parseFloat(data.total_capacity) || 0,
        "Alert Status": data.alert_status || "HEALTHY"
      });
    });

    if (ingredients.length === 0) {
      logger.info("No active ingredients found in Firestore. Creating dummy seed row for report completeness...");
      ingredients.push({
        "Ingredient Name": "Seed Record (Empty)",
        "Opening Stock (KG/Ltr)": 0,
        "Today Inward (In)": 0,
        "Today Issued (Out)": 0,
        "Current Available Stock": 0,
        "Minimum Threshold (KG/Ltr)": 0,
        "Total Capacity (KG/Ltr)": 0,
        "Alert Status": "HEALTHY"
      });
    }

    // 2. Parse into structured spreadsheet standard
    const wb = XLSX.utils.book_new();
    
    // Add administrative metadata banner row
    const timestampStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    const banner = [
      ["Operational Checkpoint: Pre-Market Review Summary | Generated at: " + timestampStr],
      [] // spacing row
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(banner);
    
    // Append headers and data rows starting at A3 (offset)
    XLSX.utils.sheet_add_json(ws, ingredients, { origin: "A3" });
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Daily Stock Report");

    // 3. Compile spreadsheet file in-memory as a binary object buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // 4. Write output directly into Cloud Storage bucket path
    // Format destination path: /daily-kitchen-logs/YYYY-MM-DD/Daily_Stock_Report_YYYY-MM-DD_21-00.xlsx
    const kolkataNowStr = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" }); // YYYY-MM-DD
    const destinationPath = `daily-kitchen-logs/${kolkataNowStr}/Daily_Stock_Report_${kolkataNowStr}_21-00.xlsx`;
    
    logger.info(`Archiving daily stock ledger to Cloud Storage path: ${destinationPath}`);
    const bucket = admin.storage().bucket();
    const file = bucket.file(destinationPath);
    
    await file.save(buffer, {
      metadata: {
        contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    });

    // 5. Log a validation handshake code 200 upon successful file block serialization
    logger.info(`Handshake 200: Daily stock report successfully archived to ${destinationPath}`);
    return { status: 200, message: "Handshake 200: Stock reconciliation archive successful." };

  } catch (error) {
    logger.error("Failed to execute daily stock reconciliation scheduled run: ", error);
    throw error;
  }
});
