import { GapptUser } from "../entities/gappt-user.entity";

export interface GapptUserInterface {
  /**
   * find entry sequence by entry sequence and user id
   * @param entrySequence e.g. "00001"
   */
  findByEntrySequence(entrySequence: string, userId: string): Promise<GapptUser | null>;
}
