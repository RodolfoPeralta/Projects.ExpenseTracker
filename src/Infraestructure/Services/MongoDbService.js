import mongoose from "mongoose";
import LoggerService from "../../Application/Services/LoggerService.js";

const logger = LoggerService.Logger();

class MongoDbService {

    static async Connect(db) {
        try {
            const url = `${db}/expense_tracker`;
            await mongoose.connect(url);
            logger.info(`[MongoDbService] Connection with MongoDB established on '${url}'`);
        }
        catch(error) {
            logger.info(`[MongoDbService] Error when trying to connect with MongoDB database. Message: ${error}`);
        }
    }

    static async GetItems(model) {
        try {
            const items = await model.find({});

            if(items.length === 0) {
                return [];
            }

            if(!items) {
                return null;
            }

            return items;
        }
        catch(error) {
            throw(`[MongoDbService] ${error}`);
        }
    }

    static async GetItemById(model, id) {
        try {
            const item = await model.findById(id);

            if(!item) {
                return null;
            }

            return item;
        }
        catch(error) {
            throw(`[MongoDbService] ${error}`);
        }
    }

    static async CreateItem(model, item=[]) {
        try {
            const newItem = new model({
                ...item
            });

            const saved = await newItem.save();

            if(!saved) {
                return null;
            }

            return saved;
        }
        catch(error) {
            throw(`[MongoDbService] ${error}`);
        }
    }

    static async UpdateItemById(model, id, item) {
        try {
            const updated = await model.findByIdAndUpdate(
                                            id, 
                                            { $set: item }, 
                                            { new:true, returnDocument: "after", runValidators: true });

            if(!updated) {
                return null;
            }

            return updated;
        }
        catch(error) {
            throw(`[MongoDbService] ${error}`);
        }
    }

    static async DeleteItemById(model, id) {
        try {
            const item = await model.findOneAndDelete({_id: id});

            if(!item) {
                return null;
            }

            return item;
        }
        catch(error) {
            throw(`[MongoDbService] ${error}`);
        }
    }

    static async Aggregate(model, options) {
        try {
            const pipeline = [];

            if(options.query) {
                pipeline.push({ $match: options.query });
            }

            if(options.sort) {
                pipeline.push({ $sort: options.sort });
            }

            if(options.page && options.limit) {
                const skip = (options.page - 1) * options.limit;
                pipeline.push({ $skip: skip});
            }

            if(options.limit) {
                pipeline.push({ $limit: options.limit });
            }

            return await model.aggregate(pipeline);
        }
        catch(error) {
            throw(`[MongoDbService] ${error}`);
        }
    }

}

export default MongoDbService;