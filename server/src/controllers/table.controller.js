import TableServiceProvider from "../services/table.service";

const TableService = new TableServiceProvider();

export async function index(_req, res, next) {
  try {
    const tables = await TableService.all();

    res.json(tables);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const tables = await TableService.create(req.body);

    res.json(tables);
  } catch (error) {
    next(error);
  }
}

export async function describe(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await TableService.describe(tableName);

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function describeTimeToLive(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await TableService.describeTimeToLive(tableName);

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function updateTimeToLive(req, res, next) {
  try {
    const { tableName } = req.params;
    const { TimeToLiveSpecification } = req.body;

    const isEnable = TimeToLiveSpecification.Enabled;

    if (isEnable) {
      await TableService.disableTimeToLive(tableName);
      await TableService.updateTimeToLive(tableName, req.body);
    } else {
      await TableService.disableTimeToLive(tableName);
    }

    const data = await TableService.describeTimeToLive(tableName);

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await TableService.destroy(tableName);

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await TableService.update(tableName, req.body);

    res.json(data);
  } catch (error) {
    next(error);
  }
}
