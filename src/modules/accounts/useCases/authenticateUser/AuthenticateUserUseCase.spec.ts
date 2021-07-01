import { AppError } from "@shared/errors/AppError"
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO"
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory"
import { CreateUserUseCase } from "@modules/accounts/useCases/createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory"
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider"

let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: UsersRepositoryInMemory
let createUserUseCase: CreateUserUseCase
let userTokensRepositoryInmemory: UsersTokensRepositoryInMemory
let dateProvider: DayjsDateProvider

describe("Authenticate User", () => {
  beforeEach(() => {
    dateProvider = new DayjsDateProvider()
    userTokensRepositoryInmemory = new UsersTokensRepositoryInMemory()
    usersRepositoryInMemory = new UsersRepositoryInMemory()
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      userTokensRepositoryInmemory,
      dateProvider
    )
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "001234",
      email: 'user@test.com',
      password: '1234',
      name: "User Test"
    }

    await createUserUseCase.execute(user)
    const result = await authenticateUserUseCase.execute({ email: user.email, password: user.password })

    expect(result).toHaveProperty('token')
  })

  it("should not be able to authenticate an nonexistent user", async () => {

    await expect(
      authenticateUserUseCase.execute({
        email: 'user@test.com',
        password: '1234'
      })
    ).rejects.toEqual(new AppError("Email or password Incorrect"))
  })

  it("should not be able to authenticate with incorrect password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "001234",
      email: 'user@test.com',
      password: '1234',
      name: "User Test"
    }

    await createUserUseCase.execute(user)

    await expect(
      authenticateUserUseCase.execute({
        email: 'user@test.com',
        password: 'IncorrectPassword'
      })
    ).rejects.toEqual(new AppError("Email or password Incorrect"))
  })
})