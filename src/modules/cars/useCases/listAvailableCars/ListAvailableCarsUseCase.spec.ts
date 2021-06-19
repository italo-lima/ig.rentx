import { CarsRepositoryinMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryinMemory"
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase"

let listAvailableCarsUseCase: ListAvailableCarsUseCase
let carsRepositoryInMemory: CarsRepositoryinMemory

describe('List Cars', () => {

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryinMemory()
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(carsRepositoryInMemory)
  })

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      "name": "Car1",
      "description": "Carro grande",
      "license_plate": "DEF-1234",
      "daily_rate": 110.00,
      "fine_amount": 30,
      "brand": "Audi",
      "category_id": "category_id"
    })

    const cars = await listAvailableCarsUseCase.execute({})

    expect(cars).toEqual([car])
  })

  it('should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      "name": "Car2",
      "description": "Carro grande",
      "license_plate": "DEF-1234",
      "daily_rate": 110.00,
      "fine_amount": 30,
      "brand": "Car_brand",
      "category_id": "category_id"
    })

    const cars = await listAvailableCarsUseCase.execute({
      brand: "Car_brand"
    })

    expect(cars).toEqual([car])
  })

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      "name": "Car3",
      "description": "Carro grande",
      "license_plate": "DEF-1234",
      "daily_rate": 110.00,
      "fine_amount": 30,
      "brand": "Car_brand",
      "category_id": "category_id"
    })

    const cars = await listAvailableCarsUseCase.execute({
      name: "Car3"
    })

    expect(cars).toEqual([car])
  })

  it('should be able to list all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      "name": "Car3",
      "description": "Carro grande",
      "license_plate": "DEF-1234",
      "daily_rate": 110.00,
      "fine_amount": 30,
      "brand": "Car_brand",
      "category_id": "12345"
    })

    const cars = await listAvailableCarsUseCase.execute({
      category_id: "12345"
    })

    expect(cars).toEqual([car])
  })
})