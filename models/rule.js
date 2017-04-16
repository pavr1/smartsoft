var mongoose = require('mongoose');

//Rule schema creation
var ruleSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    condition: {
        type: String,
        require: true
    }
});

var Rule = module.exports = mongoose.model('Rule', ruleSchema);

//Get Rules
module.exports.getRules = function (callback, limit) {
    Rule.find(callback).limit(limit);
}

//Get Rule by ID
module.exports.getRule = function (id, callback) {
    Rule.findById(id, callback);
}

//Add Rule
module.exports.addRule = function (name, condition, callback) {
    var rule = {
        name: name,
        condition: condition
    };

    Rule.create(rule, callback);
}

//Update Rule
module.exports.updateRule = function (id, name, condition, callback) {
    var query = { _id: id };

    var update = {
        name: name,
        condition: condition
    };

    Rule.findOneAndUpdate(query, update, '', callback);
}

//Delete Rule
module.exports.deleteRule = function (id, callback) {
    var query = { _id: id };

    Rule.remove(query, callback);
}