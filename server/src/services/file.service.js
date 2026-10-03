import path from "path";

export default class FileServiceProvider {
  getExtension(file) {
    const extention = path.extname(file.originalname).toLowerCase();

    return extention;
  }

  getParser(file) {
    const extention = this.getExtension(file);

    switch (extention) {
      case ".json":
        return this.parseJSON;
    }
  }

  parseJSON(file) {
    const data = file.buffer.toString("utf-8");

    return JSON.parse(data);
  }

  async parse(file) {
    const parser = this.getParser(file);

    const data = await parser(file);

    return data;
  }
}
