import redis from 'redis'
import bluebird from 'bluebird';

const configureRedis = function() {
  //promisifying node_redis with bluebird
  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);
  const client = redis.createClient({
    host: process.env.DEMO_REDIS || '127.0.0.1', // demo, change if need
    port: 6379  // demo port, change if need
  })
  return client
}

const client = configureRedis()

export default client

/**
 * test
 */
// const client = configureRedis()
// client.setAsync('test', 'Nick Channnn').then(redis.print)

