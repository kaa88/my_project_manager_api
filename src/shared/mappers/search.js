export class SearchParams {
  constructor(params = {}) {
    if (params.search !== undefined) this.search = params.search;
    // else {
    //   this.id = params.id;
    //   this.createdAt = params.createdAt;
    //   this.updatedAt = params.updatedAt;

    //   this.title = params.title;
    //   this.description = params.descr;
    //   this.expire = params.expire;
    //   this.priority = params.priority;
    //   this.subtasks = params.subtasks;
    // this.labelId = params.label;
    // this.groupId = params.group;
    // this.creatorId = params.creator;
    // this.assigneeId = params.assignee;
    // this.commentsId = params.comments;
    // this.attachmentsId = params.attachments;
    // }
  }
}
