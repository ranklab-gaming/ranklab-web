const hkdf = require("futoin-hkdf")
const { createSecretKey } = require("crypto")
const { generalDecrypt, GeneralEncrypt } = require("jose")

module.exports = async function ({ value, secret }) {
  const derivedKey = hkdf(secret, 32, { info: "JWE CEK", hash: "SHA-256" })
  const secretKey = crypto.createSecretKey(derivedKey)

  const jwe = await new GeneralEncrypt(new TextEncoder().encode(secretKey))
    .setProtectedHeader({ enc: "A256GCM" })
    .addRecipient(secretKey)
    .setUnprotectedHeader({ alg: "dir" })
    .encrypt()
  
  const { plaintext } = await generalDecrypt(jwe, secretKey)
  return JSON.parse(new TextDecoder().decode(plaintext))
}
