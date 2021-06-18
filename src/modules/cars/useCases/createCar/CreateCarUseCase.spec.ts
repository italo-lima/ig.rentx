import { CarsRepositoryinMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryinMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateCarUseCase } from "../createCar/CreateCarUseCase"

let createCarUseCase: CreateCarUseCase
let carsRepositoryinMemory: CarsRepositoryinMemory

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryinMemory = new CarsRepositoryinMemory()
    createCarUseCase = new CreateCarUseCase(carsRepositoryinMemory)
  })

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Name Car",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-123",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category"
    })

    expect(car).toHaveProperty('id')
  })

  it('should not be able to create a car with exists license plate', () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: "Car1",
        description: "Description Car",
        daily_rate: 100,
        license_plate: "ABC-123",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category"
      })
      await createCarUseCase.execute({
        name: "Car2",
        description: "Description Car",
        daily_rate: 100,
        license_plate: "ABC-123",
        fine_amount: 60,
        brand: "Brand",
        category_id: "category"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: "Car1",
      description: "Description Car",
      daily_rate: 100,
      license_plate: "ABC-123",
      fine_amount: 60,
      brand: "Brand",
      category_id: "category"
    })

    expect(car.available).toBe(true)
  })
})