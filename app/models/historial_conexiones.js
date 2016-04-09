// Camara Class
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var historialSchema = new Schema({
    server: String,
    name:  String,
    time: String
});


//Export the schema
module.exports = mongoose.model('Historial', historialSchema);
