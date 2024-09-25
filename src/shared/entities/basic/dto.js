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

export class BasicCreateDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class BasicUpdateDTO {
  // returns updated fields only
  constructor(entity, queryEntityValues = {}, GetDTO = BasicGetDTO) {
    const updatedEntityValues = {};
    for (let key in queryEntityValues) {
      updatedEntityValues[key] = entity[key];
    }

    const dto = new GetDTO({
      ...new GetDTO(entity), // add id and dates
      ...updatedEntityValues,
    });

    for (let key in dto) {
      if (dto[key] === undefined) delete dto[key];
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
