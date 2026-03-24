const { db } = require('../config/firebase');
const { computeRecommendations } = require('../services/recommendationEngine');

const getProfile = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const snap = await userRef.get();
    // Return empty profile if document doesn't exist yet (new user)
    if (!snap.exists) {
      return res.status(200).json({
        displayName: req.user.name || '',
        alStream: '',
        alResults: {},
        olResults: {},
        skills: [],
        interests: [],
        recommendations: [],
        profileComplete: false,
      });
    }
    res.status(200).json(snap.data());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProfile = async (req, res) => {
  const { displayName, alStream, alResults, olResults, skills, interests } = req.body;
  try {
    const recommendations = computeRecommendations({ alStream, alResults, olResults, skills, interests });

    // Use set+merge so it creates the document if it doesn't exist yet
    await db.collection('users').doc(req.user.uid).set({
      displayName: displayName || '',
      alStream: alStream || '',
      alResults: alResults || {},
      olResults: olResults || {},
      skills: skills || [],
      interests: interests || [],
      recommendations,
      profileComplete: true,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    res.status(200).json({ message: 'Profile updated', recommendations });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
