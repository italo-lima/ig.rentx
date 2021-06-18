import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "@shared/errors/AppError";
import { UsersRepository } from "@modules/accounts/infra/repositories/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token missing', 401)
  }

  const [, token] = authHeader.split(' ')
  
  try {
    const { sub: user_id } = verify(token, '71658fba9a5f6604f97056600b7e04a4') as IPayload
    
    const userRepository = new UsersRepository()
    const user = await userRepository.findById(user_id)

    if (!user) {
      throw new AppError('User Does not exists', 401)
    }

    request.user = {
      id: user_id
    }

    next()
    
  } catch {
    throw new AppError('Invalid Token', 401)
  }
}