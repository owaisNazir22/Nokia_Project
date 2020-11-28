const mongoose = require ('mongoose');

var shirtSchema = new mongoose.Schema ({
    shirtName : {
        type : String,
        required : "This field is required."
    },
    shirtColor : {
        type : String,
        required : "This field is required."
    },
    shirtSize : {
        type : String,
        required : "This field is required"
    }
});

mongoose.model ('Shirt',shirtSchema);