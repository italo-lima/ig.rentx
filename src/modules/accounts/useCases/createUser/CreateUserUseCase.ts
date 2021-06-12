import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt"

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AppError } from "../../../../errors/AppError";

@injectable()
class CreateUserUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  async execute({ name, driver_license, email, password }: ICreateUserDTO): Promise<void> {

    const userAlreadExists = await this.usersRepository.findByEmail(email)

    if (userAlreadExists) {
      throw new AppError('User already exists')
    }

    const passwordHash = await hash(password, 8)

    await this.usersRepository.create({
      name,
      driver_license,
      email,
      password: passwordHash
    })
  }
}

export { CreateUserUseCase }