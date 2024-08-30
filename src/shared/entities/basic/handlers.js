import { ApiError, Message } from "../../../services/error/index.js";
import { db } from "../../../db/db.js";
import {
  BasicCreateDTO,
  BasicDeleteDTO,
  BasicGetDTO,
  BasicUpdateDTO,
} from "./dto.js";
import { BasicEntity } from "./entity.js";
import { PaginationDTO, PaginationParams } from "../../mappers/pagination.js";
import { BasicSearchParams } from "../../mappers/search.js";
import { getIdsFromQuery } from "../../utils/idsFromQuery.js";
import { isObject } from "../../utils/utils.js";

export class BasicHandlers {
  constructor({ model, entity = BasicEntity, dto = {} }) {
    if (!model)
      throw ApiError.internal("No model provided to controller constructor");
    if (typeof entity !== "function")
      throw ApiError.internal(
        Message.incorrect("entity", ["class", "function"])
      );
    if (!isObject(dto))
      throw ApiError.internal(Message.incorrect("dto", "object"));

    this.create = new CreateHandler(
      model,
      entity,
      dto.create || BasicCreateDTO
    );
    this.update = new UpdateHandler(
      model,
      entity,
      dto.update || BasicUpdateDTO
    );
    this.delete = new DeleteHandler(
      model,
      entity,
      dto.delete || BasicDeleteDTO
    );
    this.findOne = new FindOneHandler(model, entity, dto.get || BasicGetDTO);
    this.findMany = new FindManyHandler(model, entity, dto.get || BasicGetDTO);
    // this.search = new SearchHandler();
  }
}

function CreateHandler(model, Entity, CreateDTO) {
  return async (req) => {
    const values = new Entity(req.body);

    const response = await db.create({ model, values });
    if (!response) throw ApiError.internal("Database error");

    return new CreateDTO(response);
  };
}

function UpdateHandler(model, Entity, UpdateDTO) {
  return async (req) => {
    setQueryIds(req);
    const query = req.queryIds;

    delete req.body.id;
    const values = new Entity(req.body);

    if (!Object.keys(values).length)
      throw ApiError.badRequest(
        "Update failed due to missing or invalid fields"
      );

    values.updatedAt = new Date();

    const response = await db.update({ model, query, values });
    if (!response) throw ApiError.notFound(Message.notFound(query));

    // console.log(new UpdateDTO(response, values));

    return new UpdateDTO(response, values);
  };
}

function DeleteHandler(model, Entity, DeleteDTO) {
  return async (req) => {
    setQueryIds(req);
    const query = req.queryIds;

    const response = await db.update({
      model,
      query: { ...query, deletedAt: null },
      values: { deletedAt: new Date() },
    });
    if (!response) throw ApiError.notFound(Message.notFound(query));

    return new DeleteDTO(response);
  };
}

function FindOneHandler(model, Entity, GetDTO) {
  return async (req) => {
    setQueryIds(req);
    const query = { ...new Entity(req.query), ...req.queryIds };

    // temp
    const related = {
      // project: true,
      // boards: { columns: { id: true } },
      // teams: { columns: { id: true } },
      // comments: true,
      // files: true,
      // labels: true,
      // tasks: true,
      // taskLists: true,
      // teams: true,
    };

    const response = await db.findOne({ model, query, related });
    if (!response) throw ApiError.notFound(Message.notFound(query));

    return new GetDTO(response);
  };
}

function FindManyHandler(model, Entity, GetDTO) {
  return async (req) => {
    const query = {
      ...new PaginationParams(req.query),
      ...new BasicSearchParams(req.query),
      ...new Entity(req.query),
      deletedAt: null,
    };

    let response = await db.findMany({ model, query });
    const itemDTOs = response.items.map((item) => new GetDTO(item, true));

    return new PaginationDTO(query, itemDTOs, response.total);
  };
}

//

const setQueryIds = (req) => {
  req.queryIds = req.queryIds || {};
  if (!req.queryIds.id)
    req.queryIds.id = getIdsFromQuery(["id"], {
      ...req.query,
      ...req.params,
    }).id;
};
