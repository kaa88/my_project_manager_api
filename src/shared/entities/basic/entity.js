import { toNumberArray } from "../../utils/utils.js";

export class BasicEntity {
  constructor(data = {}) {
    if (data.id !== undefined) {
      const ids = toNumberArray(data.id).filter((id) => id);
      if (!ids.length) this.id = undefined;
      else if (ids.length === 1) this.id = ids[0];
      else this.id = ids;
      // Здесь можно указать в поиске 1 или несколько id строкой через запятую или массивом. Они конвертируются в массив.
      // Для совместимости с операцией create один id переводится в число.
    }
    if (data.createdAt !== undefined) this.createdAt = data.createdAt;
    if (data.updatedAt !== undefined) this.updatedAt = data.updatedAt;
    if (data.deletedAt !== undefined) this.deletedAt = data.deletedAt;
  }
}
