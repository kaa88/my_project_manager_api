import { BasicDeleteDTO, BasicGetDTO, BasicUpdateDTO } from "../basic/dto.js";
import { GetDTO as ProjectDTO } from "../../../entities/project/dto.js";

export class ProjectElemGetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.relativeId = entity.relativeId;
    this.projectId = entity.projectId;
    if (entity.project) this.project = new ProjectDTO(entity.project, true);
  }
}

export class ProjectElemCreateDTO extends ProjectElemGetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class ProjectElemUpdateDTO extends BasicUpdateDTO {
  constructor(entity, updatedEntityValues = {}, GetDTO = ProjectElemGetDTO) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export class ProjectElemDeleteDTO extends BasicDeleteDTO {
  constructor(entity) {
    super(entity);
    if (this.relativeId) this.relativeId = entity.relativeId;
    this.projectId = entity.projectId;
  }
}
