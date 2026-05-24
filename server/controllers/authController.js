const passport = require('passport');
const jwt = require('jsonwebtoken');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });

// GET /auth/github — initiate OAuth
exports.githubAuth = passport.authenticate('github', { scope: ['user', 'read:org', 'repo'] });

// GET /auth/callback — GitHub OAuth callback
exports.githubCallback = [
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`);
  },
];

// POST /auth/logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  req.logout?.(() => {});
  res.json({ message: 'Logged out successfully' });
};

// GET /auth/me
exports.getMe = (req, res) => {
  const { githubId: _, accessToken: __, ...safeUser } = req.user.toObject();
  res.json(safeUser);
};
