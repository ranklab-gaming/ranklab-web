const hkdf = require("futoin-hkdf")
const { generalDecrypt } = require("jose")

module.exports = async function ({ value, secret }) {
  const key = hkdf(secret, 32, { info: "JWE CEK", hash: "SHA-256" })
  const jwe = { ciphertext: value }
  const decoder = new TextDecoder()
  const { plaintext } = await generalDecrypt(jwe, key)
  return JSON.parse(decoder.decode(plaintext))
}
