export function BuildNavigationTree(flatData: any) {

    if (flatData.length === 0) {
        return []
    }
    const rightsMap: any = {};
    const tree: any = [];

    // Step 1: create a lookup map, and add children = []
    flatData.forEach(r => {
        rightsMap[r.RightsId] = {
            RightsId: r.RightsId,
            DisplayName: r.DisplayName,
            Url: r.Url,
            children: []
        };
    });

    // Step 2: link parents and children
    flatData.forEach(r => {
        if (r.ParentRightsId) {
            rightsMap[r.ParentRightsId]?.children.push(rightsMap[r.RightsId]);
        } else {
            tree.push(rightsMap[r.RightsId]);
        }
    });

    return tree;
}