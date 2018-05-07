var mongoose = require("mongoose");



var ItemSchema = new mongoose.Schema({
    
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
    item_description: {
        item_name: String,
        category: String,
        price: Number,
        condition: Number,
        description: String,
        availability: String 
    },
    
    image_path: String,
    
    bidding:[{
        bidder_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        offer: Number
    }]
});


module.exports = mongoose.model("Item", ItemSchema);