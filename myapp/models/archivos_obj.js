var mongoose = require('mongoose');
 
module.exports = mongoose.model('archivos_obj',{
    _originalname: String,
    _localname: String,
    _path_and_name: String,
    _path: String,
    _encoding: String,
    _mimetype: String,
    _size: Number,
    _updated: { type: Date, default: Date.now }
});
// TODO - Definir cuales atributos serán UNIQUE