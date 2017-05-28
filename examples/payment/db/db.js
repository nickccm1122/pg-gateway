import redis from 'redis'
import bluebird from 'bluebird';

const configureRedis = function() {
  //promisifying node_redis with bluebird
  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);
  const client = redis.createClient()
  return client
}

const client = configureRedis()

export default client

/**
 * test
 */
// const client = configureRedis()
// client.setAsync('test', 'Nick Channnn').then(redis.print)

