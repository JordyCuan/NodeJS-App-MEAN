var mongoose = require('mongoose');
 
module.exports = mongoose.model('prefixa_users',{
    _name: String,
    _password: String,
    _email: String
});
