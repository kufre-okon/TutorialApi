module.exports = {
    getPagination: (page, size) => {
        const limit = size ? +size : 10;

        if (page < 1) {
            throw ("Page index cannot be below 1.");
        }

        page = page || 1;
        page--;

        const offset = page * limit;

        return { limit, offset, page };
    },
    getPagingData: (data, page, limit) => {
        const { count: totalItems, rows: items } = data;
        const totalPages = Math.ceil(totalItems / limit);
       
        const itemStart = (page * limit) + 1;
        const itemEnd = Math.min((page * limit) + limit, totalItems);

        return { itemStart, itemEnd, totalItems, totalPages, currentPage: ++page, items };
    }

}