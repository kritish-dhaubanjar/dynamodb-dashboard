import { Router } from "express";
import * as ItemController from "../controllers/item.controller";
import {
  validateScan,
  validateQuery,
  validateDelete,
  validateCreate,
  validateUpdate,
  validateCount,
  validateTruncate,
} from "../validators/item.validators";

const router = Router();

router.post("/:tableName/items", [validateCreate], ItemController.create);
router.put("/:tableName/items", [validateUpdate], ItemController.update);

router.post("/:tableName/items/get", [validateCreate], ItemController.get);
router.post("/:tableName/items/scan", [validateScan], ItemController.scan);
router.post("/:tableName/items/query", [validateQuery], ItemController.query);
router.post("/:tableName/items/delete", [validateDelete], ItemController.destroy);
router.post("/:tableName/items/count", [validateCount], ItemController.count);
router.put("/:tableName/items/truncate", [validateTruncate], ItemController.truncate);

export default router;
