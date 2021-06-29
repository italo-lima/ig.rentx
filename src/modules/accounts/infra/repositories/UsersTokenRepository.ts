import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/entities/UserTokens";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";

class UsersTokenRepository implements IUserTokensRepository {

  private repository: Repository<UserTokens>

  constructor() {
    this.repository = getRepository(UserTokens);
  }

  async create({ user_id, expires_date, refresh_token }: ICreateUserTokenDTO): Promise<UserTokens> {

    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id
    })

    await this.repository.save(userToken)
    return userToken
  }

  async findByUserIdAndRefreshToken(user_id: string, refresh_token: string): Promise<UserTokens> {
    const userTokens = await this.repository.findOne({
      user_id,
      refresh_token
    })

    return userTokens
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id)
  }

}

export { UsersTokenRepository }