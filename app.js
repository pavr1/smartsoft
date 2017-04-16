var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Rule = require('./models/rule');

app.use(express.static(__dirname + "\\client"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Db connection
mongoose.connect('mongodb://localhost:27017/smartsoft');

var db = mongoose.connection;

app.get('/', function (req, res) {
    res.send('Please use the /api/rules');
});

//Get Rules
app.get('/api/rules', function (req, res) {
    Rule.getRules(function (err, rules) {
        if (err) {
            throw err;
        } else {
            res.json(rules);
        }
    });
});

//Get Rule
app.get('/api/rules/:_id', function (req, res) {
    Rule.getRule(req.params._id, function (err, rule) {
        if (err) {
            throw err;
        } else {
            res.json(rule);
        }
    });
});

//Add Rule
app.post('/api/rules', function (req, res) {
    var rule = req.body;

    Rule.addRule(rule.name, rule.condition, function (err, rule) {
        if (err) {
            throw err;
        } else {
            res.json(rule);
        }
    });
});

//Update Rule
app.put('/api/rules/:_id', function (req, res) {
    var id = req.params._id;
    var rule = req.body;

    Rule.updateRule(id, rule.name, rule.condition,
		function (err, rule) {
		    if (err) {
		        throw err;
		    } else {
		        res.json(rule);
		    }
		});
});

//Delete Rule
app.delete('/api/rules/:_id', function (req, res) {
    var id = req.params._id;

    Rule.deleteRule(id,
		function (err, rule) {
		    if (err) {
		        throw err;
		    } else {
		        res.json(rule);
		    }
		});
});


//ServerWebSocket
var ws = require("nodejs-websocket")

var server = ws.createServer(function (conn) {
    conn.on("text", function (str) {
        var http = require('http');
        var url = "http://localhost:3000/api/rules";

        http.get(url, function (response) {
            var finalData = "";
            var factArray = [];

            var jsonstr = JSON.parse(str);

            //create an array of the fact to be processed
            var i = 0;
            for (var item in jsonstr) {
                if (jsonstr[item].constructor.name.toString() == 'String') {
                    factArray[i] = item.toLowerCase() + '°' + jsonstr[item].toLowerCase();

                    console.log('--- ' + factArray[i]);
                    i++;
                }
            }
            //--

            response.on("data", function (data) {
                finalData += data.toString();

                var jsonrules = JSON.parse(finalData);
                var rulesArray = [];

                //create an array of the rules to validate against the fact array
                i = 0;
                for (var item in jsonrules) {
                    var ruleconditionJson = JSON.parse(jsonrules[item]["condition"]);

                    for (var subitem in ruleconditionJson) {
                        if (ruleconditionJson[subitem].constructor.name.toString() == 'String') {
                            rulesArray[i] = subitem.toLowerCase() + '°' + ruleconditionJson[subitem].toLowerCase();

                            console.log('String: ' + rulesArray[i]);

                            i++;
                        } else if (ruleconditionJson[subitem].constructor.name.toString() == 'Array') {
                            rulesArray[i] = subitem.toLowerCase() + '°' + ruleconditionJson[subitem];

                            console.log('Array: ' + rulesArray[i]);

                            i++;
                        }
                    }
                }
                //--

                var rulesPassed = [];
                i = 0;

                //looping through the fact and rules array to process rules
                for (var rule in rulesArray) {
                    var rulesplit = rulesArray[rule].split('°');
                    var rulestring = rulesplit[1];

                    for (var fact in factArray) {
                        var split = factArray[fact].split('°');

                        rulestring = rulestring.replace(split[0], split[1]);
                    }

                    console.log('Formatted Rule: ' + rulestring + '---' + 'Formatted Rule Result: ' + eval(rulestring));

                    if (eval(rulestring)) {
                        rulesPassed[i] = rulesplit[0];
                        console.log('Rule Passed! ' + rulesPassed[i]);

                        i++;
                    }
                }

                var output = '';

                for (var passedIds in rulesPassed) {
                    console.log('rulesPassed[passedIds]: ' + rulesPassed[passedIds]);
                    output += '"' + rulesPassed[passedIds] + '",';
                }

                if (output == '') {
                    output = '{"No Result": "No rules passed"}';
                } else {
                    output = output.substring(0, output.length - 1);
                    output = "[" + output + "]";
                }

                console.log('output: ' + output);
                conn.sendText(output);
            });

            response.on("end", function () {
                //no code for end
            });
        });
    })
    conn.on("close", function (code, reason) {
        conn.close();
        console.log("Connection closed");
    });
}).listen(8001);


app.listen(3000);

console.log('Server running on port 3000');