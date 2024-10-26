const { db, admin } = require('../utils/firebase');
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

