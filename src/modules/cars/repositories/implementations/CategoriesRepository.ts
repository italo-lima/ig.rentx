import { getRepository, Repository } from "typeorm"
import { Category } from "../../entities/Category"
import { ICategoriesRepository, ICreateCategoryDTO } from "../ICategoriesRepository"

class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>

  constructor() {
    this.repository = getRepository(Category)
  }

  async create({ description, name }: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create({ name, description })

    await this.repository.save(category)

  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find()
    
    return categories
  }

  findByName(name: string): Promise<Category> {
    return this.repository.findOne({name})
  }
}

export { CategoriesRepository }