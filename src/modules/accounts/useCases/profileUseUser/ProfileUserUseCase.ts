import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { User } from "@modules/accounts/infra/entities/User";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class ProfileUserUSeCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) { }

  // Use classToclass e @Exclude() do class transform 
  // classToClass no controller e exclude na entity
  // async execute(id: string): Promise<User> {
  //   const user = await this.usersRepository.findById(id)
  //   return user
  // }

  async execute(id: string): Promise<IUserResponseDTO> {
    const user = await this.usersRepository.findById(id)

    return UserMap.toDTO(user)
  }
}

export { ProfileUserUSeCase }