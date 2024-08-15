export class BasicDTO {
  constructor(entity) {
    // temp for tests:
    this.globalId = entity.globalId;
    this.projectId = entity.projectId;
    // /
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
  }
}

export class BasicGetDTO extends BasicDTO {
  constructor(entity, isShortResult) {
    // use 'isShortResult' for insecure queries, e.g. if you want to hide some user props from other users
    super(entity);
    // ...specific values
  }
}

export class BasicCreateDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class BasicUpdateDTO {
  // returns updated fields only
  constructor(entity, updatedEntityValues = {}, GetDTO = BasicGetDTO) {
    const dto = new GetDTO({
      ...new BasicDTO(entity), // add id and dates
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
    this.id = entity.id;
    this.message = "Successfully deleted";
  }
}
