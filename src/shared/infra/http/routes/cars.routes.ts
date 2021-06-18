import { CreateCarController } from "@modules/cars/useCases/createCar/CreateController"
import { Router } from "express"

const carsRoutes = Router()

const createCarController = new CreateCarController()

carsRoutes.post('/', createCarController.handle)

export { carsRoutes }