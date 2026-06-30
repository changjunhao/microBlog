import Post from '../models/post.mjs'
import User from '../models/user.mjs'

/** POST /post — Create a new post */
export async function create(req, res, next) {
  try {
    const currentUser = req.session.user
    const post = new Post(currentUser.name, req.body.post)
    await post.save()
    req.flash('success', '发表成功')
    res.redirect('/u/' + currentUser.name)
  } catch (err) {
    next(err)
  }
}

/** GET /u/:user — Show a user's posts */
export async function userPosts(req, res, next) {
  try {
    const user = await User.findByUsername(req.params.user)
    if (!user) {
      req.flash('error', '用户不存在')
      return res.redirect('/')
    }

    const posts = await Post.findByUser(user.name)
    res.render('user', {
      title: user.name,
      posts
    })
  } catch (err) {
    next(err)
  }
}
