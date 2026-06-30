import { body, validationResult } from 'express-validator'

/**
 * Process validation results and flash errors on failure.
 * Returns a 422 response for API requests, or redirects with flash for web requests.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0]
    req.flash('error', firstError.msg)

    // Determine referrer for redirect
    const referrer = req.get('Referrer') || '/'
    return res.redirect(referrer)
  }
  next()
}

/** Validation rules for user registration */
export const registerValidators = [
  body('username')
    .trim()
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 2, max: 24 }).withMessage('用户名长度需在 2-24 个字符之间')
    .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/).withMessage('用户名只能包含字母、数字、下划线和中文')
    .escape(),
  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6, max: 128 }).withMessage('密码长度需在 6-128 个字符之间'),
  body('password-repeat')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('两次输入的密码不一致')
      }
      return true
    }),
  handleValidationErrors
]

/** Validation rules for login */
export const loginValidators = [
  body('username')
    .trim()
    .notEmpty().withMessage('请输入用户名'),
  body('password')
    .notEmpty().withMessage('请输入密码'),
  handleValidationErrors
]

/** Validation rules for creating a post */
export const postValidators = [
  body('post')
    .trim()
    .notEmpty().withMessage('内容不能为空')
    .isLength({ max: 500 }).withMessage('内容长度不能超过 500 个字符'),
  handleValidationErrors
]
