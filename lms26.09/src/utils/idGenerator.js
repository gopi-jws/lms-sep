// utils/idGenerator.js

export const getNextId = (storageKey) => {
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (!Array.isArray(data) || data.length === 0) {
        return 1;
    }

    const numericIds = data
        .map(item => parseInt(item.id, 10))
        .filter(id => !isNaN(id));

    if (numericIds.length === 0) {
        return 1;
    }

    const maxId = Math.max(...numericIds);

    return maxId + 1;
};
