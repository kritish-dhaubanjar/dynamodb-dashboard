import axios from "axios";

import config from "../../constants/config";

const baseURL = `http://${config.app.host}:${config.app.port}/${config.app.prefix}/api`;

export default axios.create({ baseURL: baseURL });
