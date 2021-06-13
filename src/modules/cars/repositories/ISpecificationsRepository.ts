import { Specification } from "../infra/typeorm/entities/Specification";

interface ICreateSpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create(data: ICreateSpecificationDTO): Promise<void>
  findByName(name: string): Promise<Specification>
}

export { ISpecificationsRepository, ICreateSpecificationDTO }