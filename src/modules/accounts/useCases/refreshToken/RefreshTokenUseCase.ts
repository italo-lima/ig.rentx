import auth from "@config/auth"
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository"
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider"
import { AppError } from "@shared/errors/AppError"
import { sign, verify } from "jsonwebtoken"
import { inject, injectable } from "tsyringe"

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
class RefreshTokenUseCase {

  constructor(
    @inject('UsersTokenRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) { }

  async execute(token: string): Promise<string> {

    const { sub, email } = verify(token, auth.secret_refresh_token) as IPayload

    const user_id = sub

    const userToken = await this.userTokensRepository
      .findByUserIdAndRefreshToken(user_id, token)

    if (!userToken) {
      throw new AppError("Refresh Token does not exists!")
    }

    await this.userTokensRepository.deleteById(userToken.id)

    const refresh_token = sign({ email }, auth.secret_refresh_token, {
      subject: sub,
      expiresIn: auth.expires_in_refresh_token
    })

    const expires_date = this.dateProvider.addDays(auth.expires_refresh_token_days)

    await this.userTokensRepository.create({
      expires_date,
      user_id: sub,
      refresh_token
    })

    return refresh_token
  }
}

export { RefreshTokenUseCase }