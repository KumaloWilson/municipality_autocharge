const { db, admin } = require('../utils/firebase');
const moment = require('moment'); // For handling dates
// Get all residents
exports.getResidents = async () => {
    const snapshot = await db.collection('residents').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


// Update resident balance by email
exports.updateResidentBalanceByEmail = async (email, newBalance) => {
    // Find resident document by email
    const residentQuery = await db.collection('residents').where('email', '==', email).get();

    // Check if a resident with this email exists
    if (residentQuery.empty) {
        throw new Error(`Resident with email ${email} not found.`);
    }

    // Get the resident document ID (assuming emails are unique and only one document will match)
    const residentDoc = residentQuery.docs[0];
    const residentId = residentDoc.id;

    // Update the resident's balance
    await db.collection('residents').doc(residentId).update({
        balances: admin.firestore.FieldValue.arrayUnion(newBalance)
    });
};


exports.updateAllResidentsBalances = async () => {
    const currentMonth = moment().format('MMMM'); // e.g., "November"
    const currentYear = moment().format('YYYY');  // e.g., "2024"
    const bins = 5.00; // Fixed value
    const rates = 25.00; // Fixed value
    const sewerage = 8.00; // Fixed value

    // Fetch all residents
    const snapshot = await db.collection('residents').get();
    const residents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const updates = residents.map(async resident => {
        // Determine balance carried forward from the latest month
        const balances = resident.balances || [];
        const lastBalance = balances.length > 0 ? balances[balances.length - 1] : null;

        const balanceCarriedForward = lastBalance?.currentBalance || 0;
        const monthTotal = balanceCarriedForward + bins + rates + sewerage;

        const newBalance = {
            month: currentMonth,
            year: currentYear,
            balanceCarriedForward,
            bins,
            rates,
            sewerage,
            currentBalance: monthTotal,
            monthlyPayments: [],
        };

        // Update the resident's document
        await db.collection('residents').doc(resident.id).update({
            balances: admin.firestore.FieldValue.arrayUnion(newBalance),
        });
    });

    // Wait for all updates to complete
    await Promise.all(updates);
};