import Redis from "ioredis"
import isEmpty from "lodash/isEmpty"

const client = new Redis(process.env.REDIS_URL!, { keyPrefix: "oidc:" })

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

function grantKeyFor(id: string) {
  return `grant:${id}`
}

function userCodeKeyFor(userCode: string) {
  return `userCode:${userCode}`
}

function uidKeyFor(uid: string) {
  return `uid:${uid}`
}

class RedisAdapter {
  name: string

  constructor(name: string) {
    this.name = name
  }

  async upsert(id: string, payload: any, expiresIn: number) {
    const key = this.key(id)
    const multi = client.multi()

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

      const ttl = await client.ttl(grantKey)

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

  async find(id: string) {
    const data = consumable.has(this.name)
      ? await client.hgetall(this.key(id))
      : await client.get(this.key(id))

    if (isEmpty(data)) {
      return undefined
    }

    if (typeof data === "string") {
      return JSON.parse(data)
    }

    const { payload, ...rest } = data as any

    return {
      ...rest,
      ...JSON.parse(payload),
    }
  }

  async findByUid(uid: string) {
    const id = await client.get(uidKeyFor(uid))
    return this.find(id!)
  }

  async findByUserCode(userCode: string) {
    const id = await client.get(userCodeKeyFor(userCode))
    return this.find(id!)
  }

  async destroy(id: string) {
    const key = this.key(id)
    await client.del(key)
  }

  async revokeByGrantId(grantId: string) {
    const multi = client.multi()
    const tokens = await client.lrange(grantKeyFor(grantId), 0, -1)
    tokens.forEach((token) => multi.del(token))
    multi.del(grantKeyFor(grantId))
    await multi.exec()
  }

  async consume(id: string) {
    await client.hset(this.key(id), "consumed", Math.floor(Date.now() / 1000))
  }

  key(id: string) {
    return `${this.name}:${id}`
  }
}

export default RedisAdapter
