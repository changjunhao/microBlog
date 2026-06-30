import debugLib from 'debug'

const debug = debugLib('microblog:error')

/**
 * Wrap an async route handler to catch errors and forward them to next().
 * Eliminates the need for try/catch in every route.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }))
 *
 * @param {Function} fn - An async Express route handler
 * @returns {Function} Wrapped handler that forwards errors to Express error middleware
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * 404 Not Found handler.
 * Catches requests that didn't match any route.
 */
export function notFoundHandler(req, res, next) {
  const err = new Error('页面未找到')
  err.status = 404
  next(err)
}

/**
 * Global error handler.
 * Renders different error pages for development and production.
 */
export function globalErrorHandler(err, req, res, _next) {
  debug('Error [%s]: %s', err.status || 500, err.message)

  // Set locals for the error template
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Respond with JSON for API requests
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(err.status || 500).json({
      error: {
        message: err.message,
        status: err.status || 500
      }
    })
  }

  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  })
}
