import { BasicDeleteDTO, BasicGetDTO, BasicUpdateDTO } from "./basicDTO.js";

export class ProjectElemGetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.projectId = entity.projectId;
    if (entity.project) this.project = entity.project;

    // temp for tests:
    this.globalId = entity.globalId;
  }
}

export class ProjectElemCreateDTO extends ProjectElemGetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class ProjectElemUpdateDTO extends BasicUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, ProjectElemGetDTO);
  }
}

export const ProjectElemDeleteDTO = BasicDeleteDTO;
