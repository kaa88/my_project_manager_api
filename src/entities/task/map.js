import {
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "../../shared/mappers/basicDTO.js";

export class Entity {
  constructor(data) {
    this.title = data ? data.title : "";
    this.description = data ? data.descr : "";
    this.expire = data ? data.expireDate : "";
    this.priority = data ? data.priority : 0;
    this.subtasks = data ? data.subtasks : "";
    // this.label = data ? data.label : "";
    // this.group = data ? data.group : [];
    // this.creator = data ? data.creator : "";
    // this.assignee = data ? data.assignee : [];
    // this.comments = data ? data.comments : "";
    // this.attachments = data ? data.attachments : [];

    // for (let key in this) {
    //   if (this[key] === undefined) delete this[key];
    // }
  }
}

export class GetDTO extends BasicGetDTO {
  constructor(entity) {
    super(entity);
    this.title = entity.title;
    this.descr = entity.description;
    this.expire = entity.expire;
    this.priority = entity.priority;
    this.subtasks = entity.subtasks;
    // this.labelId = entity.label;
    // this.groupId = entity.group;
    // this.creatorId = entity.creator;
    // this.assigneeId = entity.assignee;
    // this.commentsId = entity.comments;
    // this.attachmentsId = entity.attachments;
  }
}
export class CreateDTO extends GetDTO {
  constructor(entity) {
    super(entity);
  }
}

export class UpdateDTO extends BasicUpdateDTO {
  constructor(entity, updatedEntityValues = {}) {
    super(entity, updatedEntityValues, GetDTO);
  }
}

export const DeleteDTO = BasicDeleteDTO;
