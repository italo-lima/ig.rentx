import multer from "multer"
import { resolve } from "path"
import { randomBytes } from "crypto"

const tmpFolder = resolve(__dirname, "..", "..", "tmp")

export default {
  tmpFolder,

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, cb) => {
      const fileHash = randomBytes(16).toString('hex')
      const fileName = `${fileHash}-${file.originalname}`

      return cb(null, fileName)
    }
  })
}