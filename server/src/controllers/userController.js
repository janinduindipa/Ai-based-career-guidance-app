const { db } = require('../config/firebase');

const getProfile = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const snap = await userRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(snap.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { displayName, stream, subjects, skills, interests } = req.body;
  try {
    await db.collection('users').doc(req.user.uid).update({
      displayName, stream, subjects, skills, interests,
      profileComplete: true,
      updatedAt: new Date().toISOString(),
    });
    res.status(200).json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
