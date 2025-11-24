import { WhereOptions } from "@sequelize/core";
import { currentUserInitials } from "@src/shared/utils/user-context";

/**
 * Injects context-based filters (like userProfile)
 * into an existing where condition.
 *
 * @param where - existing where condition
 */
export function withContextFilters<T extends object>(
  where: WhereOptions<T>
): WhereOptions<T> {
  const contextFilters: any = {
    // Always apply userInitials from current user context
    userInitials: currentUserInitials(),
  };

  return {
    ...where,
    ...contextFilters,
  };
}
