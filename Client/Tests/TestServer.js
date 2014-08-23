/*
Copyright (c) 2014 Eric Vallee <eric_vallee2003@yahoo.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var BasePath = path.resolve(__dirname, '..', 'Source');
var StaticPath = path.resolve(__dirname, 'Static');

var FakeLanguageDB = {};
FakeLanguageDB['French'] = {'Blue': 'Bleu', 'House': 'Maison', 'CarLove': '%1$s aime mon %3$s %2$s', 'red': 'rouge', 'car': 'automobile', 'Submit': 'Soumettre', 'Hello': '<script>window.FrenchTranslatorFromHell = true;</script>', 'MixedFriendship': '%1$s est bonne amie avec %2$s, mais pas avec %3$s', 'FastRunner': '%1$s est un coureur rapide', 'SchoolAffection': '%1$s aime %2$s l\'école', 'Lot': 'beaucoup', 'FrostWindow': 'Fenêtre Givrée'};
FakeLanguageDB['English'] = {'Blue': 'Blue', 'House': 'House', 'CarLove': '%1$s likes my %2$s %3$s', 'red': 'red', 'car': 'car', 'Submit': 'Submit', 'Hello': 'Hello', 'MixedFriendship': '%1$s is good friends with %2$s, but not with %3$s', 'FastRunner': '%1$s is a fast runner', 'SchoolAffection': '%1$s likes school a %2$s', 'Lot': 'lot', 'FrostWindow': 'Frost Window'};

app.use(bodyParser.json());
app.use('/Base', express.static(BasePath));
app.use('/Static', express.static(StaticPath));
app.get('/Strings/:Language', function(Req, Res){
    var Return = {'Strings': {}};
    if(Req.query.Strings !== undefined && Req.query.Strings instanceof Array)
    {
        var Language = Req.params.Language;
        Req.query.Strings.forEach(function(Item, Index, Strings){
            if(FakeLanguageDB[Language] !== undefined && FakeLanguageDB[Language][Item] !== undefined)
            {
                Return['Strings'][Item] = FakeLanguageDB[Language][Item];
            }
        });
    }
    Res.json(Return);
});

app.post('/Strings/:Language', function(Req, Res){
    var Return = {'Strings': {}};
    if(Req.body.Strings !== undefined && Req.body.Strings instanceof Array)
    {
        var Language = Req.params.Language;
        Req.body.Strings.forEach(function(Item, Index, Strings){
            if(FakeLanguageDB[Language] !== undefined && FakeLanguageDB[Language][Item] !== undefined)
            {
                Return['Strings'][Item] = FakeLanguageDB[Language][Item];
            }
        });
    }
    Res.json(Return);
});

app.get('/', function(Req, Res){
    Res.redirect('/Static/Tests.html');
});

http.createServer(app).listen(8080);
