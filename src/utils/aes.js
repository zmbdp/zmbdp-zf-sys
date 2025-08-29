import CryptoJS from 'crypto-js'

// 密钥
const SECRET_KEY = '12345678abcdefgh'

// 加密
const encryptData = (plainText) => {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY)
  const srcs = CryptoJS.enc.Utf8.parse(plainText)
  return CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
}

// 解密
function decryptData(ciphertext) {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY)
  const decrypt = CryptoJS.AES.decrypt(ciphertext, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

// 加密-Hex
export function encryptHex(plainText) {
  return encryptData(plainText).ciphertext.toString()
}

// 解密-Hex
export function decryptHex(ciphertext) {
  const wordArray = CryptoJS.enc.Hex.parse(ciphertext)
  const base64Word = CryptoJS.enc.Base64.stringify(wordArray)
  return decryptData(base64Word, SECRET_KEY)
}
