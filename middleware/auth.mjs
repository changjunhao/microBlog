/**
 * Require the user to be logged in.
 * Redirects to /login with a flash error if not authenticated.
 */
export function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '请先登录')
    return res.redirect('/login')
  }
  next()
}

/**
 * Require the user to NOT be logged in.
 * Redirects to / with a flash error if already authenticated.
 */
export function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '您已登录')
    return res.redirect('/')
  }
  next()
}
