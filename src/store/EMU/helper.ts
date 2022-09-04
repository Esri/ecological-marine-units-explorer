//
export const formatEmuDataItems = <T extends { OBJECTID?: number }>(
    items: T[]
) => {
    const byObjectId = {};
    const objectIds = [];

    for (const item of items) {
        const objectId = item.OBJECTID;
        byObjectId[objectId] = item;
        objectIds.push(objectId);
    }

    return {
        byObjectId,
        objectIds,
    };
};
