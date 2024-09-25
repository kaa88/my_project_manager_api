import { isArray } from "../../shared/utils/utils.js";
import { GetDTO as ProjectGetDTO } from "./dto.js";
import { GetDTO as BoardDTO } from "../board/map.js";
import { GetDTO as LabelDTO } from "../label/map.js";
import { GetDTO as TeamDTO } from "../team/map.js";

export class GetDTOWithRelations extends ProjectGetDTO {
  constructor(entity, isShortResult) {
    super(entity, isShortResult);
    if (entity.boards)
      this.boards = isArray(entity.boards)
        ? entity.boards.map((board) => new BoardDTO(board, true))
        : [];
    if (entity.labels)
      this.labels = isArray(entity.labels)
        ? entity.labels.map((label) => new LabelDTO(label, true))
        : [];
    if (entity.teams)
      this.teams = isArray(entity.teams)
        ? entity.teams.map((team) => new TeamDTO(team, true))
        : [];
  }
}
