const passport = require('passport');
const jwt = require('jsonwebtoken');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });

// GET /auth/github — initiate OAuth, always force account selection
exports.githubAuth = (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: 'user read:org repo',
    redirect_uri: `http://localhost:${process.env.PORT || 5000}/auth/callback`,
    prompt: 'select_account',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};


// GET /auth/callback — GitHub OAuth callback
exports.githubCallback = [
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      // Session-only: no maxAge, cookie cleared when browser closes
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
