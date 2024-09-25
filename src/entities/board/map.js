import { ApiError, Message } from "../../services/error/index.js";
import { ProjectElemEntity } from "../../shared/entities/projectElem/entity.js";
import {
  ProjectElemGetDTO,
  ProjectElemDeleteDTO,
  ProjectElemUpdateDTO,
} from "../../shared/entities/projectElem/dto.js";
import { GetDTO as TeamsToBoardsDTO } from "../_relationTables/teamsToBoards/map.js";
import { GetDTO as CommentDTO } from "../comment/map.js";
import { GetDTO as FileDTO } from "../file/map.js";
import { GetDTO as TaskDTO } from "../task/map.js";
import { isArray, isObject, toNumberOrNull } from "../../shared/utils/utils.js";

export class Board extends ProjectElemEntity {
  constructor(data = {}) {
    super(data);
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined)
      this.description = data.description || "";
    if (data.image !== undefined) this.image = data.image || "";

    if (data.taskLists !== undefined) {
      if (!isArray(data.taskLists))
        throw ApiError.badRequest(Message.incorrect("taskLists", "Array"));
      this.taskLists = data.taskLists.map((item) => new TaskList(item));
    }

    if (data.creatorId !== undefined)
      this.creatorId = toNumberOrNull(data.creatorId);

    // controller handled props: teamIds
  }
}

export class TaskList {
  constructor(data) {
    if (isObject(data)) {
      this.id = toNumberOrNull(data.id);
      if (data.title !== undefined) this.title = String(data.title);
      if (data.description !== undefined)
        this.description = String(data.description);
      if (data.color !== undefined) this.color = String(data.color);
    }
  }
}

export class GetDTO extends ProjectElemGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    this.title = entity.title;
    this.description = entity.description;
    this.image = entity.image;
    this.taskLists = entity.taskLists;
    this.creatorId = entity.creatorId;
    // relations:
    if (entity.teamsToBoards)
      this.teamsToBoards = isArray(entity.teamsToBoards)
        ? entity.teamsToBoards.map((item) => new TeamsToBoardsDTO(item, true))
        : [];
    if (entity.comments)
      this.comments = isArray(entity.comments)
        ? entity.comments.map((item) => new CommentDTO(item, true))
        : [];
    if (entity.files)
      this.files = isArray(entity.files)
        ? entity.files.map((item) => new FileDTO(item, true))
        : [];
    if (entity.tasks)
      this.tasks = isArray(entity.tasks)
        ? entity.tasks.map((item) => new TaskDTO(item, true))
        : [];

    // controller handled props: teamIds
  }
}
export class CreateDTO extends GetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class UpdateDTO extends ProjectElemUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export const DeleteDTO = ProjectElemDeleteDTO;
