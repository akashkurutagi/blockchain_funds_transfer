var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const Web3 = require('web3');
    var web3 = new Web3('http://localhost:8545')
const LocalStorage = require('node-localstorage').LocalStorage,localStorage = new LocalStorage('./scratch');
var sendaddr;
	var toaddr ;
    var amount;

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/home.html'));
});

app.post('/send', function(request, response) {
	var sendaddr = request.body.sendaddr;
	var toaddr = request.body.toaddr;
    var amount = request.body.amt;
   // console.log(sendaddr);
   localStorage.setItem('sendAddr',sendaddr);
   localStorage.setItem('toAddr',toaddr);
   localStorage.setItem('Amount',amount);
    web3.eth.sendTransaction({
    from: sendaddr,
    gasPrice: "20000000000",
    gas: "21000",
    to: toaddr,
    value: amount,
    data: ""
}, 'node1').once('transactionHash', function(hash)
    { 
       // setTimeout(function(){
            localStorage.setItem('thash',hash);
        console.log(hash); 
       // },5000)
        
    });
    response.redirect('/last');
	
});

app.get('/last', function(request, response) {
    setTimeout(function(){
        var sendaddr= localStorage.getItem('sendAddr')
        var toaddr= localStorage.getItem('toAddr')
        var amount= localStorage.getItem('Amount')
        var hash= localStorage.getItem('thash')
       // console.log(sendaddr);
		response.send('Send Address: '+ sendaddr + '<br/>To Address: '+ toaddr + '<br/>Amount: '+ amount+ '<br/>Transaction Hash: '+hash);
    },5000)
        
});
app.listen(3000);