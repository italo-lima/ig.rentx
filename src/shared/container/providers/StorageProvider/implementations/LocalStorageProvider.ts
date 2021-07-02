import upload from "@config/upload";
import { promises } from "fs";
import { resolve } from "path";

import { IStorageProvider } from "../IStorageProvider";

class LocalStorageProvider implements IStorageProvider {

  async save(file: string, folder: string): Promise<string> {
    await promises.rename(
      resolve(upload.tmpFolder, file),
      resolve(`${upload.tmpFolder}/${folder}`, file)
    )

    return file
  }

  async delete(file: string, folder: string): Promise<void> {
    const filename = resolve(`${upload.tmpFolder}/${folder}`, file)

    try {
      await promises.stat(filename)
    } catch {
      return
    }

    await promises.unlink(filename)
  }

}

export { LocalStorageProvider }