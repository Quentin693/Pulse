const Activity = require('../models/Activity');
const NFCBracelet = require('../models/NFCBracelet');

async function getProfile(req, res) {
  res.json({ user: req.user.toPrivateJSON() });
}

async function updateProfile(req, res) {
  Object.assign(req.user, req.body);
  if (req.body.socials) {
    req.user.socials = { ...req.user.socials, ...req.body.socials };
  }
  await req.user.save();
  res.json({ user: req.user.toPrivateJSON() });
}

async function getStats(req, res) {
  const userId = req.user._id;
  const [activityCount, bracelets, recent] = await Promise.all([
    Activity.countDocuments({ user: userId }),
    NFCBracelet.find({ owner: userId }),
    Activity.find({ user: userId }).sort({ performedAt: -1 }).limit(5),
  ]);

  const totals = await Activity.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        durationMin: { $sum: '$durationMin' },
        distanceKm: { $sum: '$distanceKm' },
        calories: { $sum: '$calories' },
      },
    },
  ]);

  res.json({
    totals: totals[0] || { durationMin: 0, distanceKm: 0, calories: 0 },
    activityCount,
    braceletCount: bracelets.length,
    totalTaps: bracelets.reduce((s, b) => s + (b.tapCount || 0), 0),
    recent,
  });
}

module.exports = { getProfile, updateProfile, getStats };
