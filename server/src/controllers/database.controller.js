import AWS from "../config/aws";
import DatabaseServiceProvider from "../services/database.service";

export async function index(req, res, next) {
  try {
    const { credentials } = req.body;
    const DatabaseService = new DatabaseServiceProvider(AWS, credentials);
    const data = await DatabaseService.all();

    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function restore(req, res, next) {
  try {
    const { credentials, tableNames } = req.body;
    const DatabaseService = new DatabaseServiceProvider(AWS, credentials);
    const data = await DatabaseService.restore(tableNames);

    return res.json(data);
  } catch (error) {
    next(error);
  }
}
