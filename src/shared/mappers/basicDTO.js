export class BasicDTO {
  constructor(entity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}

export class BasicGetDTO extends BasicDTO {
  constructor(entity) {
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
