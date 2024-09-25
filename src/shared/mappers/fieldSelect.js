import { isArray, isObject } from "../utils/utils.js";

export class FieldSelectParams {
  constructor(params = {}) {
    // здесь по-хорошему должна быть проверка с рекурсией есть ли поля в модели
    if (isObject(params.columns)) this.columns = params.columns;
    if (typeof params.columns === "string") params.columns = [params.columns];
    if (isArray(params.columns)) {
      const colNames = params.columns.reduce(
        (result, col) =>
          typeof col === "string" && col ? [...result, col] : result,
        []
      );
      if (colNames.length) {
        this.columns = {};
        colNames.forEach((cn) => (this.columns[cn] = true));
      }
    }

    if (isObject(params.with)) this.with = params.with;
  }
}
