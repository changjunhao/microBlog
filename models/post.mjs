import { getDb } from './db.mjs'

/**
 * @typedef {Object} PostDoc
 * @property {string} user
 * @property {string} post
 * @property {Date} time
 */

class Post {
  /**
   * @param {string} username
   * @param {string} content
   * @param {Date} [time]
   */
  constructor(username, content, time) {
    this.user = username
    this.post = content
    this.time = time || new Date()
  }

  /**
   * Save the post to the database.
   * @returns {Promise<import('mongodb').InsertOneResult>}
   */
  async save() {
    const db = await getDb()
    const collection = db.collection('posts')
    await collection.createIndex({ user: 1 })
    return collection.insertOne({
      user: this.user,
      post: this.post,
      time: this.time
    })
  }

  /**
   * Get all posts, optionally filtered by username.
   * @param {string} [username] - Filter by username. Omit for all posts.
   * @returns {Promise<Post[]>}
   */
  static async findAll(username) {
    const db = await getDb()
    const collection = db.collection('posts')
    const query = username ? { user: username } : {}
    const docs = await collection.find(query).sort({ time: -1 }).toArray()
    return docs.map(doc => new Post(doc.user, doc.post, doc.time))
  }

  /**
   * Get posts by a specific user.
   * @param {string} username
   * @returns {Promise<Post[]>}
   */
  static async findByUser(username) {
    return Post.findAll(username)
  }
}

export default Post
