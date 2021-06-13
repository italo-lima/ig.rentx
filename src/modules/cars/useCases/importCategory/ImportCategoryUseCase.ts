import fs from "fs"
import csvParse from "csv-parse"
import { inject, injectable } from "tsyringe"

import { ICategoriesRepository } from "@modules/cars/repositories/ICategoriesRepository"

interface IImportCategory {
  name: string;
  description: string;
}

@injectable()
class ImportCategoryUseCase {

  constructor(
    @inject('CategoriesRepository')
    private categoryReposity: ICategoriesRepository
  ) { }
  
  loadCategories(file: Express.Multer.File): Promise<IImportCategory[]> {
    return new Promise((resolve, reject) => {
      const categories: IImportCategory[] = []
      const stream = fs.createReadStream(file.path)

      const parseFile = csvParse()

      stream.pipe(parseFile)

      parseFile
        .on('data', async (line) => {
        const [name, description] = line
        categories.push({name, description})
        })
        .on('end', () => {
          fs.promises.unlink(file.path)
          resolve(categories)
        })
        .on('error', (error) => reject(error))
      })
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file)
    
    categories.forEach(async category => {
      const { description, name } = category

      const existsCategory = await this.categoryReposity.findByName(name)

      if (!existsCategory) {
        await this.categoryReposity.create({name, description})
      }
    })
  }
}

export {ImportCategoryUseCase}