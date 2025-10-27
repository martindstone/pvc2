import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Allowed email domains (comma-separated), e.g. "example.com,sub.example.com"
const ALLOWED_EMAIL_DOMAINS: string[] = (process.env.ALLOWED_EMAIL_DOMAINS || '')
  .split(',')
  .map(d => d.trim().toLowerCase())
  .filter(Boolean);

const isEmailDomainAllowed = (email?: string): boolean => {
  if (!email) return false;
  if (ALLOWED_EMAIL_DOMAINS.length === 0) return true; // if unset, allow all
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && ALLOWED_EMAIL_DOMAINS.includes(domain);
};

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/auth/google/callback"
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    console.log('Google profile received:', profile);
    const email = profile.emails?.[0]?.value;
    if (!email || !isEmailDomainAllowed(email)) {
      // Reject sign-in for disallowed domains
      console.log('Disallowed email domain:', email);
      return done(null, false, { message: 'domain_not_allowed' });
    }

    // Minimal user object stored in session
    const user = {
      id: profile.id,
      email,
      name: profile.displayName,
    };
    console.log('Authenticated user:', user);
    return done(null, user);
  } catch (error) {
    return done(error as Error, undefined);
  }
}));

// Store minimal user object in session for Passport
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

export class AuthController {
  // Initiate Google OAuth
  googleAuth = passport.authenticate('google', {
    scope: ['openid', 'email', 'profile']
  });

  // Google OAuth callback - default middleware form
  googleCallback = passport.authenticate('google', {
    session: true,
    successRedirect: '/',
    failureRedirect: '/login?error=auth_failed'
  });

  // Logout
  logout = (req: Request, res: Response, next: NextFunction) => {
    // Passport logout (clears req.user)
    const doDestroy = () => {
      req.session.destroy(err => {
        if (err) return next(err);
        // Clear session cookie (default name: connect.sid)
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
      });
    };

    if (typeof (req as any).logout === 'function') {
      (req as any).logout((err?: any) => {
        if (err) return next(err);
        doDestroy();
      });
    } else {
      doDestroy();
    }
  };

  // Get current user / authorization state
  getCurrentUser = (req: Request, res: Response) => {
    const isAuth = (typeof (req as any).isAuthenticated === 'function' && (req as any).isAuthenticated());

    if (!isAuth) {
      return res.status(401).json({ authorized: false });
    }

    const user = req.user as any;
    return res.json({ authorized: true, user });
  };
}