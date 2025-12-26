import { Model } from "@sequelize/core";

// Domain-facing model class (attribute names are domain-y)
export class GapptUserModel extends Model {
  public entrySequence!: string; // K00001
  public status!: string; // F00001
}
