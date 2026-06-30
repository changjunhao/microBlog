import { Router } from 'express'
import { asyncHandler } from '../middleware/errorHandler.mjs'
import { checkLogin, checkNotLogin } from '../middleware/auth.mjs'
import { registerValidators, loginValidators, postValidators } from '../middleware/validator.mjs'
import * as authController from '../controllers/authController.mjs'
import * as postController from '../controllers/postController.mjs'
import * as pageController from '../controllers/pageController.mjs'

const router = Router()

// ── Home ──
router.get('/', asyncHandler(pageController.home))

// ── User posts ──
router.get('/u/:user', asyncHandler(postController.userPosts))

// ── Create post (requires login) ──
router.post('/post', checkLogin, postValidators, asyncHandler(postController.create))

// ── Registration ──
router.get('/reg', checkNotLogin, authController.registerPage)
router.post('/reg', checkNotLogin, registerValidators, asyncHandler(authController.register))

// ── Login ──
router.get('/login', checkNotLogin, authController.loginPage)
router.post('/login', checkNotLogin, loginValidators, asyncHandler(authController.login))

// ── Logout (requires login) ──
router.get('/logout', checkLogin, authController.logout)

export default router
