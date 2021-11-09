const hkdf = require("futoin-hkdf")
const { JWE, JWK, JWKS } = require("jose")

module.exports = function ({ value, secret }) {
  const keystore = new JWKS.KeyStore()
  const derivedKey = hkdf(secret, 32, { info: "JWE CEK", hash: "SHA-256" })
  const key = JWK.asKey(derivedKey)

  keystore.add(key)

  return JSON.parse(
    JWE.decrypt(value, keystore, {
      complete: true,
      contentEncryptionAlgorithms: ["A256GCM"],
      keyManagementAlgorithms: ["dir"],
    }).cleartext.toString()
  )
}
