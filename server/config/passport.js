const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID || 'dummy_id',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy_secret',
    callbackURL: `http://localhost:${process.env.PORT || 5000}/auth/callback`,
    scope: ['user', 'read:org', 'repo'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ githubId: profile.id });

      if (user) {
        user.accessToken = accessToken;
        user.name = profile.displayName || profile.username;
        user.avatarUrl = profile.photos?.[0]?.value || '';
        await user.save();
      } else {
        user = await User.create({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          username: profile.username,
          email: profile.emails?.[0]?.value || '',
          avatarUrl: profile.photos?.[0]?.value || '',
          accessToken,
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
