const { auth, db } = require('../config/firebase');

const registerUser = async (req, res) => {
  const { uid, email, displayName } = req.user;
  try {
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      await userRef.set({
        uid,
        email,
        displayName: displayName || '',
        createdAt: new Date().toISOString(),
        profileComplete: false,
      });
    }
    res.status(200).json({ message: 'User registered', uid });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

module.exports = { registerUser };
