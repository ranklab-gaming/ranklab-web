const Redis = require("ioredis")
const isEmpty = require("lodash/isEmpty")

const redisUrl = process.env.REDIS_URL

const grantable = new Set([
  "AccessToken",
  "AuthorizationCode",
  "RefreshToken",
  "DeviceCode",
  "BackchannelAuthenticationRequest",
])

const consumable = new Set([
  "AuthorizationCode",
  "RefreshToken",
  "DeviceCode",
  "BackchannelAuthenticationRequest",
])

function grantKeyFor(id) {
  return `grant:${id}`
}

function userCodeKeyFor(userCode) {
  return `userCode:${userCode}`
}

function uidKeyFor(uid) {
  return `uid:${uid}`
}

class RedisAdapter {
  constructor(name) {
    this.client = new Redis(redisUrl)
    this.name = name
  }

  async upsert(id, payload, expiresIn) {
    const key = this.key(id)
    const multi = this.client.multi()

    if (consumable.has(this.name)) {
      multi.hmset(key, { payload: JSON.stringify(payload) })
    } else {
      multi.set(key, JSON.stringify(payload))
    }

    if (expiresIn) {
      multi.expire(key, expiresIn)
    }

    if (grantable.has(this.name) && payload.grantId) {
      const grantKey = grantKeyFor(payload.grantId)
      multi.rpush(grantKey, key)

      const ttl = await this.client.ttl(grantKey)

      if (expiresIn > ttl) {
        multi.expire(grantKey, expiresIn)
      }
    }

    if (payload.userCode) {
      const userCodeKey = userCodeKeyFor(payload.userCode)
      multi.set(userCodeKey, id)
      multi.expire(userCodeKey, expiresIn)
    }

    if (payload.uid) {
      const uidKey = uidKeyFor(payload.uid)
      multi.set(uidKey, id)
      multi.expire(uidKey, expiresIn)
    }

    await multi.exec()
  }

  async find(id) {
    const data = consumable.has(this.name)
      ? await this.client.hgetall(this.key(id))
      : await this.client.get(this.key(id))

    if (isEmpty(data)) {
      return undefined
    }

    if (typeof data === "string") {
      return JSON.parse(data)
    }

    const { payload, ...rest } = data

    return {
      ...rest,
      ...JSON.parse(payload),
    }
  }

  async findByUid(uid) {
    const id = await this.client.get(uidKeyFor(uid))

    if (!id) {
      return undefined
    }

    return this.find(id)
  }

  async findByUserCode(userCode) {
    const id = await this.client.get(userCodeKeyFor(userCode))

    if (!id) {
      return undefined
    }

    return this.find(id)
  }

  async destroy(id) {
    const key = this.key(id)
    await this.client.del(key)
  }

  async revokeByGrantId(grantId) {
    const multi = this.client.multi()
    const tokens = await this.client.lrange(grantKeyFor(grantId), 0, -1)
    tokens.forEach((token) => multi.del(token))
    multi.del(grantKeyFor(grantId))
    await multi.exec()
  }

  async consume(id) {
    await this.client.hset(
      this.key(id),
      "consumed",
      Math.floor(Date.now() / 1000)
    )
  }

  key(id) {
    return `${this.name}:${id}`
  }
}

module.exports = RedisAdapter
