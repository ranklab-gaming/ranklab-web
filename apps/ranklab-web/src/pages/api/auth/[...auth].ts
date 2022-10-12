import { Configuration, Provider } from "oidc-provider"

const config: Configuration = {
  clients: [
    {
      client_id: "web",
      client_secret: process.env.AUTH_CLIENT_SECRET,
      grant_types: ["refresh_token", "authorization_code"],
      redirect_uris: [`${process.env.WEB_HOST}/api/auth/callback`],
    },
  ],
  interactions: {
    url(_ctx, interaction) {
      return `/auth/${interaction.uid}`
    },
  },
  async findAccount(_ctx, id) {
    return {
      accountId: id,
      async claims(_use, _scope) {
        return { sub: id }
      },
    }
  },
  cookies: {
    keys: [
      "some secret key",
      "and also the old rotated away some time ago",
      "and one more",
    ],
  },
  claims: {
    email: ["email"],
    profile: ["nickname", "picture"],
  },
  features: {
    devInteractions: { enabled: false }, // defaults to true
    revocation: { enabled: true }, // defaults to false
  },
  jwks: {
    keys: [
      {
        p: "6gAQVLKnvF6boOcqDcqejQMjQ458JG-GNXYSMh5ZbPAPbF_8RpN0DhGnqowQSFIyz2VVk1M3F7V8SoZU33L5vXB2MbiewyfzZxjnKtY6S0TEerKYYnhiyYuO2PsQRNOubsrzO5Rihn2ITmM_ZE5Zfa7ZsYaallsjnBJbATvoI30",
        kty: "RSA",
        q: "oebZ-A7M4jOQC8BOuNstv-qm18mplD_2agIBLQMiUa022fl-u6nrRzlZ1aMUk1mn9TIVg54tKoN2blZNOQApG2JONGQ8J6DHA3GkbGvsz1qarfCCLtNYm-XE_8rFkQoYGOJN308d_OQuqkCuzxWM27bfKHdIL5nzQvzBamOOeq0",
        d: "gNsOPL_cSKoSyNxuhFbUDQF6oYCGYKb-fsxF4uQKPu_G_ovD3-RyIwZP64_4s1VrWazqtFvlk-1OfxyPdrC0FEm9sq4FN7a-gr_o2VQweYbiwGMAVKyN6ztPj5XQF2F8DuJPqh_d1q6nnapsZ8_KYokwtBJ82EQq5-mQ8BpGl1S4qI33XZsv46wxdIYmEVvsU5QhNPOONHQXQxGYbCFAVOwNcq8f2RcB3V89bGvVeIcKrl1a17WpjSLrwzHkcWOGQBI6f0_00wk9QqGUyE2sCln8VxkA6urTPQqDPakcrz_AoyGwrnQjQgFsYHwSDJJuH5s3OAc5azPq4zCMkB9AgQ",
        e: "AQAB",
        use: "sig",
        kid: "sig-1665562398",
        qi: "bN24EqNS7IvgOK6YEq-4LwlzUH3-uFYk10ht-kFhJgt9Zh9Gu2am2g1XDum6AUYYu1L7pzWGiCTzXtGSo3uTbEUVtsX9ivpXKdLNDhukiaA6TXNwNqYWVNnSsYNAf81h_Ud_UGen2FlEwOdDo6LGEyVwnjFJVgFS_mX39vRnNC8",
        dp: "BLwHmI8c0bTgVTsYILtOxe-gUQea_2m6P26qI5V1nbylsz2l7w-gs4Ar8klvMudm28djGd3_KV2krCVXpkW_Q9P4sDzaCXzPcfCRDM7U0x0LFKh0aNmitg060K0TwTC_QMKedUAlVi9ICL39VFw5d0-IXA0rJ4ukhs3gRYAezEk",
        dq: "IdY-nfJx7aC7LUmO6mGciSzAm_7gu0Q2-ubaWg76oDlkamATlaMosiURWm4QAc_OI5fJGU34wJbjLKJK12vqK3f7QkXksJ-QmG6q36Iaxyd3hnzqqGCxdzupVZCKhAqpCKJbhh1h9hW2jwyfvFYTr2Pj9fAgHRq-1bQ_tD2EbK0",
        n: "k_0NkLvi5VzTZwkKl0Mv26IA8k3qZlhbL3VYCIOzo_PS_Ky2FX_PzEkDM9whLT-N8GOmI2qsIBkiL8hdZi2gxYazylyhYpIGyjHLf8oQ7fsH0hZTldMmVDz9JE70nEUjfxPXJEg-1geHd2niJmJ9n7BEm8Zdk4vgLy3MgYorN91xC19xYQgmaGCrndoDJ7ohSPNv56exCoNQpuEkVWMbxn7Pup46TNXs6PXrwvFUR5l2oLbACo1t-_3sdmjHPxid6Kl1FedRTEpe0pszPiTl-QPQY78xYXZDxxfpmxMSzu_o_HkS6_5ZfYOkWCtwjILNwqVk5hWHDc4mjAWhIx-NeQ",
      },
      {
        kty: "RSA",
        e: "AQAB",
        use: "sig",
        kid: "sig-1665562398",
        n: "k_0NkLvi5VzTZwkKl0Mv26IA8k3qZlhbL3VYCIOzo_PS_Ky2FX_PzEkDM9whLT-N8GOmI2qsIBkiL8hdZi2gxYazylyhYpIGyjHLf8oQ7fsH0hZTldMmVDz9JE70nEUjfxPXJEg-1geHd2niJmJ9n7BEm8Zdk4vgLy3MgYorN91xC19xYQgmaGCrndoDJ7ohSPNv56exCoNQpuEkVWMbxn7Pup46TNXs6PXrwvFUR5l2oLbACo1t-_3sdmjHPxid6Kl1FedRTEpe0pszPiTl-QPQY78xYXZDxxfpmxMSzu_o_HkS6_5ZfYOkWCtwjILNwqVk5hWHDc4mjAWhIx-NeQ",
      },
    ],
  },
}

export default new Provider(`${process.env.WEB_HOST}/api/auth`, config).callback
