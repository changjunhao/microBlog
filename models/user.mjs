import bcrypt from 'bcrypt'
import { getDb } from './db.mjs'
import settings from '../config/settings.mjs'

/**
 * @typedef {Object} UserDoc
 * @property {string} name
 * @property {string} password - bcrypt hashed password
 */

class User {
  /** @param {UserDoc} user */
  constructor(user) {
    this.name = user.name
    this.password = user.password
  }

  /**
   * Verify a plain-text password against the stored bcrypt hash.
   * @param {string} plainPassword
   * @returns {Promise<boolean>}
   */
  async verifyPassword(plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
  }

  /**
   * Serialize user for session storage, excluding the password hash.
   * @returns {{ name: string }}
   */
  toJSON() {
    return { name: this.name }
  }

  /**
   * Create a new user with a bcrypt-hashed password.
   * @param {{ name: string, password: string }} userData
   * @returns {Promise<User>}
   */
  static async create({ name, password }) {
    const db = await getDb()
    const collection = db.collection('users')
    await collection.createIndex({ name: 1 }, { unique: true })

    const hashedPassword = await bcrypt.hash(password, settings.bcrypt.saltRounds)
    const result = await collection.insertOne({ name, password: hashedPassword })

    return new User({ name, password: hashedPassword, _id: result.insertedId })
  }

  /**
   * Find a user by username.
   * @param {string} username
   * @returns {Promise<User|null>}
   */
  static async findByUsername(username) {
    const db = await getDb()
    const collection = db.collection('users')
    const doc = await collection.findOne({ name: username })
    return doc ? new User(doc) : null
  }
}

export default User
