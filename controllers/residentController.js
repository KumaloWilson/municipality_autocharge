
const FirestoreService = require('../services/firestoreService');

exports.autoChargeMonthlyBalances = async (req, res) => {
    try {
        // Call the function to update all residents' balances
        await FirestoreService.updateAllResidentsBalances();
        res.status(200).json({ message: "Balances updated successfully." });
        console.log("Monthly balances charged successfully.");

    } catch (error) {
        console.error("Error processing monthly charges:", error);

        res.status(500).json({ error: "Failed to update balance.", body: error.message });
    }
};

// Manual charge endpoint handler
exports.manualChargeBalance = async (req, res) => {
    try {
        const { email, month, year, bins, rates, sewerage, balanceCarriedForward } = req.body;

        // Ensure all required fields are defined and log for debugging
        if (!email || !month || !year || bins === undefined || rates === undefined || sewerage === undefined || balanceCarriedForward === undefined) {
            return res.status(400).json({ error: "Invalid input: All fields are required." });
        }

        const newBalance = calculateMonthlyBalance({ month, year, bins, rates, sewerage, balanceCarriedForward });

        // Log newBalance to verify it has all expected fields
        console.log("Generated new balance:", newBalance);

        await FirestoreService.updateResidentBalanceByEmail(email, newBalance);
        res.status(200).json({ message: "Balance updated successfully." });
    } catch (error) {
        console.error("Error in manualChargeBalance:", error);
        res.status(500).json({ error: "Failed to update balance.", body: error.message });
    }
};



const calculateMonthlyBalance = ({ month, year, bins, rates, sewerage, balanceCarriedForward }) => {
    // Calculate the total for the current month
    const monthTotal = bins + rates + sewerage;

    // Calculate the current balance by adding the carried forward balance and the monthly total
    const currentBalance = balanceCarriedForward + monthTotal;

    // Construct a new balance object for the current month
    return {
        month,
        year,
        balanceCarriedForward,
        bins,
        rates,
        sewerage,
        monthTotal,
        currentBalance
    };
};
