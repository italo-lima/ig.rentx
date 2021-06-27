import dayjs from "dayjs"

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory"
import { AppError } from "@shared/errors/AppError"
import { CreateRentalUseCase } from "./CreateRentalUseCase"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider"
import { CarsRepositoryinMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryinMemory"

let rentalsRepositoryInMemory: RentalsRepositoryInMemory
let carsRepositoryInMemory: CarsRepositoryinMemory
let createRentalUSeCase: CreateRentalUseCase
let dayJsDateJsProvider: DayjsDateProvider

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate()

  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryinMemory()
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory()
    dayJsDateJsProvider = new DayjsDateProvider()
    createRentalUSeCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayJsDateJsProvider,
      carsRepositoryInMemory
    )
  })

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUSeCase.execute({
      user_id: '1',
      car_id: "2",
      expected_return_date: dayAdd24Hours
    })

    expect(rental).toHaveProperty('id')
    expect(rental).toHaveProperty('start_date')
  })

  it("should be able to create a new rental if is another open to the same user", async () => {
    expect(async () => {
      await createRentalUSeCase.execute({
        user_id: '1',
        car_id: "2",
        expected_return_date: dayAdd24Hours
      })
      await createRentalUSeCase.execute({
        user_id: '1',
        car_id: "2",
        expected_return_date: dayAdd24Hours
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should be able to create a new rental if is another open to the same car", async () => {
    expect(async () => {
      await createRentalUSeCase.execute({
        user_id: '1',
        car_id: "test",
        expected_return_date: dayAdd24Hours
      })
      await createRentalUSeCase.execute({
        user_id: '2',
        car_id: "test",
        expected_return_date: dayAdd24Hours
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should be able to create a new rental with invalid return time", async () => {
    expect(async () => {
      await createRentalUSeCase.execute({
        user_id: '1',
        car_id: "test",
        expected_return_date: dayjs().toDate()
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})