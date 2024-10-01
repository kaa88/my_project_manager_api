export class FieldSelectParams {
  constructor(params = {}) {
    if (params.columns) this.columns = params.columns;
    if (params.with) this.with = params.with;
  }
}
