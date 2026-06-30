/**
 * Lightweight flash message middleware to replace connect-flash.
 * Stores messages in the session and exposes them to res.locals for views.
 *
 * Usage:
 *   req.flash('success', 'Operation completed')
 *   req.flash('error', 'Something went wrong')
 *
 * In views:
 *   locals.success
 *   locals.error
 */
export default function flashMiddleware(req, res, next) {
  // Attach flash helper to the request object
  req.flash = function (type, msg) {
    if (!req.session) return
    if (!req.session.flash) {
      req.session.flash = {}
    }
    if (msg) {
      // Write mode
      if (!req.session.flash[type]) {
        req.session.flash[type] = []
      }
      req.session.flash[type].push(msg)
    } else if (req.session.flash && req.session.flash[type]) {
      // Read mode: return and clear
      const messages = [...req.session.flash[type]]
      delete req.session.flash[type]
      return messages
    }
    return []
  }

  // Expose flash messages to views via res.locals
  res.locals.error = null
  res.locals.success = null

  const originalRender = res.render
  res.render = function (view, options, callback) {
    if (req.session && req.session.flash) {
      const errors = req.session.flash.error
      const successes = req.session.flash.success
      res.locals.error = errors && errors.length ? errors[errors.length - 1] : null
      res.locals.success = successes && successes.length ? successes[successes.length - 1] : null
      delete req.session.flash.error
      delete req.session.flash.success
    }
    return originalRender.call(this, view, options, callback)
  }

  next()
}
