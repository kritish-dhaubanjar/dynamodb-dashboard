import TableServiceProvider from "./services/table.service";
import { ForeignKeyTableSchema, ForeignKeyExampleItem } from "./constants/foreign-key";
import ItemServiceProvider from "./services/item.service";

export default async function setup() {
  try {
    const TableService = new TableServiceProvider();
    const ItemService = new ItemServiceProvider();

    await TableService.create(ForeignKeyTableSchema);

    const schema = ForeignKeyTableSchema.KeySchema.map(({ AttributeName }) => AttributeName)

    await ItemService.create(ForeignKeyTableSchema.TableName, schema, ForeignKeyExampleItem);
  } catch (error) { }
}
