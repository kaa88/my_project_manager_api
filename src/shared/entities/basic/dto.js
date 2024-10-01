export class BasicGetDTO {
  constructor(entity, isShortResult) {
    // use 'isShortResult' e.g. if you want to hide some user props from other users
    this.id = entity.id;
    if (!isShortResult) {
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
      if (entity.deletedAt) this.deletedAt = entity.deletedAt;
    }
  }
}

export class BasicCreateDTO {
  constructor(entity, GetDTO = BasicGetDTO) {
    Object.assign(this, new GetDTO(entity));
  }
}

export class BasicUpdateDTO {
  // returns updated fields only
  constructor(
    entity,
    updatedValues = {},
    GetDTO = BasicGetDTO,
    SharedElemGetDTO = BasicGetDTO
  ) {
    const resultKeys = Object.keys({
      ...new SharedElemGetDTO(entity), // id and dates
      ...updatedValues,
    });

    const dto = new GetDTO(entity);

    for (let key in dto) {
      if (!resultKeys.includes(key)) delete dto[key];
    }

    Object.assign(this, dto);
  }
}

export class BasicDeleteDTO {
  constructor(entity) {
    this.message = "Successfully deleted";
    this.id = entity.id;
  }
}
