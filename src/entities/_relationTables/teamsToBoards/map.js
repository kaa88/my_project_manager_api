import { GetDTO as TeamDTO } from "../../team/map.js";
import { GetDTO as BoardDTO } from "../../board/map.js";

export class Entity {
  constructor(data = {}) {
    if (data.teamId !== undefined) this.team_id = data.teamId;
    if (data.boardId !== undefined) this.board_id = data.boardId;
  }
}

export class GetDTO {
  constructor(entity) {
    this.teamId = entity.team_id;
    this.boardId = entity.board_id;
    // relations:
    if (entity.team) this.team = new TeamDTO(entity.team, true);
    if (entity.board) this.board = new BoardDTO(entity.board, true);
  }
}
