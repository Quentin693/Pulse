const User = require('../models/User');
const Activity = require('../models/Activity');
const NFCBracelet = require('../models/NFCBracelet');
const { notFound, forbidden } = require('../utils/ApiError');

async function getPublicProfile(req, res) {
  const user = await User.findOne({ handle: req.params.handle.toLowerCase() });
  if (!user) throw notFound('Profile not found');
  if (!user.publicProfile) throw forbidden('This profile is private');

  const [recent, totals] = await Promise.all([
    Activity.find({ user: user._id }).sort({ performedAt: -1 }).limit(8),
    Activity.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          durationMin: { $sum: '$durationMin' },
          distanceKm: { $sum: '$distanceKm' },
          calories: { $sum: '$calories' },
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  res.json({
    profile: user.toPublicJSON(),
    activities: recent,
    totals: totals[0] || { durationMin: 0, distanceKm: 0, calories: 0, count: 0 },
  });
}

async function tapNFC(req, res) {
  const tagId = req.params.tagId.toUpperCase();
  const bracelet = await NFCBracelet.findOne({ tagId });
  if (!bracelet || !bracelet.active) throw notFound('Bracelet not found or inactive');
  bracelet.tapCount += 1;
  bracelet.lastTapAt = new Date();
  await bracelet.save();

  const user = await User.findById(bracelet.owner);
  res.json({
    bracelet: bracelet.toJSONClient(),
    redirect: bracelet.mode === 'custom' && bracelet.targetUrl
      ? bracelet.targetUrl
      : user
      ? `/u/${user.handle}`
      : '/',
    handle: user?.handle || null,
  });
}

module.exports = { getPublicProfile, tapNFC };
