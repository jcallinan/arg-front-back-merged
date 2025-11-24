import { GapptUser } from "../../domain/entities/gappt-user.entity";
import { GapptUserModel } from "../models/gappt-user.dynamic.model";

export function gapptUserMapper(record: GapptUserModel): GapptUser | null {
  if (!record) {
    return null;
  }
  return GapptUser.create({
    entrySequence: record?.entrySequence?.trim(),
    status: record?.status?.trim(),
  });
}