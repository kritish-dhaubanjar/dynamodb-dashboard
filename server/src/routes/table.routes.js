import { Router } from "express";
import * as TableController from "../controllers/table.controller";
import { validateCreate, validateUpdate } from "../validators/table.validators";

const router = Router();

router.get("/", TableController.index);
router.get("/:tableName/describe", TableController.describe);

router.delete("/:tableName", TableController.destroy);
router.post("/", [validateCreate], TableController.create);
router.put("/:tableName", [validateUpdate], TableController.update);

export default router;
