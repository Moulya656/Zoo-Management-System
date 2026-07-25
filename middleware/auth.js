// Makes the logged-in user (if any) available to every EJS view as `currentUser`
function attachUser(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  next();
}

// Blocks access unless the visitor is logged in
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// Blocks access unless the logged-in user has the "admin" role
function requireAdmin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Access denied: admin only.');
  }
  next();
}

module.exports = { attachUser, requireLogin, requireAdmin };
