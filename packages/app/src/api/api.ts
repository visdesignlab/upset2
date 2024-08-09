import { multinetApi } from "multinet";
import { host } from "./env";

export const api = multinetApi(`${host}/api`);
