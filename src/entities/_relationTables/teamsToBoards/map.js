import { GetDTO as TeamDTO } from "../../team/map.js";
import { GetDTO as BoardDTO } from "../../board/map.js";

export class Entity {
  constructor(data = {}) {
    if (data.teamId !== undefined) this.teamId = data.teamId;
    if (data.boardId !== undefined) this.boardId = data.boardId;
  }
}

export class GetDTO {
  constructor(entity) {
    this.teamId = entity.teamId;
    this.boardId = entity.boardId;
    // relations:
    if (entity.team) this.team = new TeamDTO(entity.team, true);
    if (entity.board) this.board = new BoardDTO(entity.board, true);
  }
}
