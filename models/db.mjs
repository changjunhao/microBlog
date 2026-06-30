import { MongoClient } from 'mongodb'
import settings from '../config/settings.mjs'
import debugLib from 'debug'

const debug = debugLib('microblog:db')

const client = new MongoClient(settings.db.url, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
})

client.on('connectionReady', () => {
  debug('MongoDB connected successfully')
})

client.on('connectionClosed', () => {
  debug('MongoDB connection closed')
})

client.on('error', (err) => {
  console.error('MongoDB connection error:', err.message)
})

/** @returns {Promise<import('mongodb').Db>} */
export async function getDb() {
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect()
  }
  return client.db(settings.db.name)
}

/** @returns {MongoClient} */
export function getClient() {
  return client
}

/**
 * Gracefully close the database connection.
 * Should be called on process shutdown.
 */
export async function closeConnection() {
  await client.close()
}
