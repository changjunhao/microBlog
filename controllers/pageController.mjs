import Post from '../models/post.mjs'

/** GET / — Render the home page with all posts */
export async function home(req, res, next) {
  try {
    const posts = await Post.findAll()
    res.render('index', {
      title: '首页',
      posts
    })
  } catch (err) {
    next(err)
  }
}
