import { BattleOutcome } from '../types/battle-status.enum';

export type Battle = {
  opponents?: [Record<string, string>, Record<string, string>];
  outcome: BattleOutcome;
  winner?: Record<string, string>;
};
