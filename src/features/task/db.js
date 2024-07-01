import { count, eq, ilike } from "drizzle-orm";

export const getDbQueryChunks = ({ model, query }) => {
  const isSearch = query.search !== undefined;
  return [
    !!(isSearch || query.title) &&
      ilike(model.title, `%${isSearch ? query.search : query.title}%`),
    !!(isSearch || query.description) &&
      ilike(
        model.description,
        `%${isSearch ? query.search : query.description}%`
      ),
    // expire ?
    query.priority !== undefined && eq(model.priority, query.priority),
    // if (params.subtasks) this.subtasks = params.subtasks;

    // !!query.label && eq(model.label, query.label),
    // !!query.group && eq(model.group, query.group),
    // !!query.creator && eq(model.creator, query.creator),
    // !!query.assignee && eq(model.assignee, query.assignee),
    // if (params.comments) this.comments = params.comments;
    // if (params.attachments) this.attachments = params.attachments;
  ];
};
