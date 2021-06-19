import { CreateCarController } from "@modules/cars/useCases/createCar/CreateController"
import { Router } from "express"
import multer from "multer"

import uploadConfig from "@config/upload"
import { ensureAdmin } from "@shared/infra/http/middlewares/ensureAdmin"
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated"
import { ListAvailableCarsController } from "@modules/cars/useCases/listAvailableCars/ListAvailableCarsController"
import { CreateCarSpecificationController } from "@modules/cars/useCases/createCarSpecification/CreateCarSpecificationController"
import { UploadCarImagesController } from "@modules/cars/useCases/uploadCarImages/UploadCarImagesController"

const carsRoutes = Router()

const createCarController = new CreateCarController()
const listAvailableCarController = new ListAvailableCarsController()
const createCarSpecificationController = new CreateCarSpecificationController()
const uploadCarImagesController = new UploadCarImagesController()

const uploadCarImages = multer(uploadConfig.upload('./tmp/cars'))

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  createCarController.handle
)

carsRoutes.get('/available', listAvailableCarController.handle)

carsRoutes.post(
  '/specifications/:id',
  ensureAuthenticated,
  ensureAdmin,
  createCarSpecificationController.handle
)

carsRoutes.post(
  '/images/:id',
  ensureAuthenticated,
  ensureAdmin,
  uploadCarImages.array("images"),
  uploadCarImagesController.handle
)

export { carsRoutes }