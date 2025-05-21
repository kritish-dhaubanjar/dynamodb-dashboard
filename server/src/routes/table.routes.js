import { Router } from "express";
import * as TableController from "../controllers/table.controller";
import { validateCreate, validateUpdate, validateUpdateTimeToLive } from "../validators/table.validators";

const router = Router();

router.get("/", TableController.index);
router.get("/:tableName/describe", TableController.describe);

router.get("/:tableName/time-to-live", TableController.describeTimeToLive);
router.put("/:tableName/time-to-live", [validateUpdateTimeToLive], TableController.updateTimeToLive);

router.delete("/:tableName", TableController.destroy);
router.post("/", [validateCreate], TableController.create);
router.put("/:tableName/truncate", TableController.truncate);
router.put("/:tableName", [validateUpdate], TableController.update);

export default router;
