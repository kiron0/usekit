import CryptoJS from "crypto-js"

const encrypt = (data: unknown, secret: string): string | false => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString()
  } catch (err) {
    console.error(err)
    return false
  }
}

const decrypt = <T>(cipherText: string, secret: string): T | false => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secret)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)) as T
  } catch (err) {
    console.error(err)
    return false
  }
}

export const useEncryption = () => ({ encrypt, decrypt })
