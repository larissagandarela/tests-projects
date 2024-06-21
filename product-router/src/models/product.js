import {uuid} from 'uuidv4';

export default class Product {
    constructor(code, description, buyPrice, sellPrice, tags, id = uuid()){
        this.code = code;
        this.description = description;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
        this.tags = tags;
        this.id = id;
    }
}