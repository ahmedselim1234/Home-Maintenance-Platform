class ApiFeatures {
  constructor(mongoQuery, queryString) {
    this.mongoQuery = mongoQuery;
    this.query = queryString;
  }

  filter() {
    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    const queryObj = Object.assign({}, this.query);

    excludesFields.forEach((field) => delete queryObj[field]);

    const parsed = Object.entries(queryObj).reduce((acc, [key, val]) => {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);

      if (match) {
        const [, field, op] = match;
        acc[field] = { ...(acc[field] || {}), [`$${op}`]: Number(val) };
      } else {
        acc[key] = val;
      }
      return acc;
    }, {});

    this.mongoQuery = this.mongoQuery.find(parsed);
    return this;
  }

  search(ModelName) {
    if (this.query.keyword) {
      if (ModelName === "services" || ModelName === "Categories") {
        const keywordQuery = {
          $or: [
            { name: { $regex: this.query.keyword, $options: "i" } },
            { description: { $regex: this.query.keyword, $options: "i" } },
          ],
        };
        this.mongoQuery = this.mongoQuery.find(keywordQuery);
      } else {
        const keywordQuery = {
          $or: [{ name: { $regex: this.query.keyword, $options: "i" } }],
        };
        this.mongoQuery = this.mongoQuery.find(keywordQuery);
      }
    }
    return this;
  }

  sort() {
    console.log(this.query);
    if (typeof this.query.sort === "string") {
      const sortBy = this.query.sort.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.sort(sortBy);
      // console.log( this.mongoQuery)
    } else {
      this.mongoQuery = this.mongoQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.mongoQuery = this.mongoQuery.select(fields);
    } else {
      this.mongoQuery = this.mongoQuery.select("-__v");
    }
    return this;
  }

  paginate(CountOfDocuments) {
    const page = this.query.page * 1 || 1;
    const limit = this.query.limit * 1 || 50;
    const skip = (page - 1) * limit;

    //information about pagination
    const pagination = {};
    pagination.page = page;
    pagination.limit = limit;
    //number of pages
    pagination.NumberOfPages = Math.ceil(CountOfDocuments / limit);
    // next page
    const next = pagination.page < pagination.NumberOfPages;
    console.log(next);
    if (next) {
      pagination.nextPage = page + 1;
    }
    //previous page
    if (pagination.page > 1) {
      pagination.previous = page - 1;
    }

    this.paginatetionResult = pagination;

    this.mongoQuery = this.mongoQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = { ApiFeatures };
