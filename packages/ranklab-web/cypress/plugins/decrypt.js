const hkdf = require("futoin-hkdf")
const { createSecretKey } = require("crypto")
const { compactDecrypt } = require("jose")

module.exports = async function ({ value, secret }) {
  const derivedKey = hkdf(secret, 32, { info: "JWE CEK", hash: "SHA-256" })
  const secretKey = createSecretKey(derivedKey)
  const { plaintext } = await compactDecrypt(value, secretKey)
  return JSON.parse(new TextDecoder().decode(plaintext))
}
