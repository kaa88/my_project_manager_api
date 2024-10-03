import {
  BasicGetDTO,
  BasicCreateDTO,
  BasicUpdateDTO,
  BasicDeleteDTO,
} from "../basic/dto.js";
import { GetDTO as ProjectDTO } from "../../../entities/project/dto.js";

export class ProjectElemGetDTO extends BasicGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.relativeId = entity.relativeId;
    this.projectId = entity.projectId;
    if (entity.project) this.project = new ProjectDTO(entity.project, true);
  }
}

export class ProjectElemCreateDTO extends BasicCreateDTO {
  constructor(entity, GetDTO = ProjectElemGetDTO) {
    super(entity, GetDTO);
  }
}

export class ProjectElemUpdateDTO extends BasicUpdateDTO {
  constructor(entity, updatedValues = {}, GetDTO = ProjectElemGetDTO) {
    super(entity, updatedValues, GetDTO, ProjectElemGetDTO);
  }
}

export class ProjectElemDeleteDTO extends BasicDeleteDTO {
  constructor(entity) {
    super(entity);
    if (this.relativeId) this.relativeId = entity.relativeId;
    this.projectId = entity.projectId;
  }
}
