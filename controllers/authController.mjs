import User from '../models/user.mjs'

/** GET /login — Render the login page */
export async function loginPage(req, res) {
  res.render('login', { title: '用户登录' })
}

/** POST /login — Authenticate a user */
export async function login(req, res, next) {
  try {
    const { username, password } = req.body
    const user = await User.findByUsername(username)

    if (!user) {
      req.flash('error', '用户不存在')
      return res.redirect('/login')
    }

    const isValid = await user.verifyPassword(password)
    if (!isValid) {
      req.flash('error', '密码错误')
      return res.redirect('/login')
    }

    req.session.user = user.toJSON()
    req.flash('success', '登录成功')
    res.redirect('/')
  } catch (err) {
    next(err)
  }
}

/** GET /reg — Render the registration page */
export async function registerPage(req, res) {
  res.render('reg', { title: '用户注册' })
}

/** POST /reg — Create a new user account */
export async function register(req, res, next) {
  try {
    const { username, password } = req.body

    const existingUser = await User.findByUsername(username)
    if (existingUser) {
      req.flash('error', '用户名已被注册')
      return res.redirect('/reg')
    }

    const newUser = await User.create({ name: username, password })
    req.session.user = newUser.toJSON()
    req.flash('success', '注册成功')
    res.redirect('/')
  } catch (err) {
    next(err)
  }
}

/** GET /logout — Destroy the user session */
export async function logout(req, res) {
  req.session.user = null
  req.flash('success', '已退出登录')
  res.redirect('/')
}
