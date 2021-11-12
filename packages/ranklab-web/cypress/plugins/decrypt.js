const hkdf = require("futoin-hkdf")
const { generalDecrypt } = require("jose")

module.exports = function ({ value, secret }) {
  const key = hkdf(secret, 32, { info: "JWE CEK", hash: "SHA-256" })
  const jwe = { ciphertext: value }
  const decoder = new TextDecoder()
  return generalDecrypt(jwe, key).then(({ plaintext } => {
    return JSON.parse(decoder.decode(plaintext))
  })
}
