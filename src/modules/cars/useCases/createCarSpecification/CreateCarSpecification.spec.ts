import { CarsRepositoryinMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryinMemory"
import { SpecificationRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase"

let carsRepositoryInMemory: CarsRepositoryinMemory
let createCarSpecificationUseCase: CreateCarSpecificationUseCase
let specificationsRepositoryInMemory: SpecificationRepositoryInMemory

describe('Create Car Specification', () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryinMemory()
    specificationsRepositoryInMemory = new SpecificationRepositoryInMemory()
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationsRepositoryInMemory
    )
  })

  it("should not be abble to add a new specification to a now-existent car", async () => {
    expect(async () => {
      const car_id = "not_id"
      const specifications_id = ["1234"]
      await createCarSpecificationUseCase.execute({ car_id, specifications_id })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should be abble to add a new specification to the car", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Car1",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-123",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category"
    })

    const specification = await specificationsRepositoryInMemory.create({
      name: "test",
      description: "test"
    })

    const car_id = car.id
    const specifications_id = [specification.id]

    const specificationCars = await createCarSpecificationUseCase.execute({ car_id, specifications_id })

    expect(specificationCars).toHaveProperty("specifications")
    expect(specificationCars.specifications.length).toBe(1)
  })
})