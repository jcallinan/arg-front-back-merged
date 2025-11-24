import { sortOrder } from "@src/types/types";

export function getSortParams(
    sortArray: sortOrder[],
    defaultSort: sortOrder[]
): [string, string][] {

    const source: sortOrder[] = sortArray.length > 0 ? sortArray : defaultSort;
    return source.map(({ sortBy, sortOrder }) => [sortBy, sortOrder]);
}
