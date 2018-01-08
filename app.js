const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//Init Nexmo
const nexmo = new Nexmo({
	apiKey: 'b9c659e6',
	apiSecret: '900c4d9e9692fced'
}, {debug: true})

// init app 
const app = express();

// Template Engine Setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// index route
app.get('/', (req,res) => {
	res.render('index');
})

// Catch Form Submit 
app.post('/', (req,res) => {
	const number = req.body.number;
	const text = req.body.text;

	nexmo.message.sendSms(
		'12132055759', number, text, {type: 'unicode'},
		(err, responseData) => {
			if(err) {
				console.log(err);
			} else {
				console.dir(responseData);
				//Get Data From the Response
				const data = {
					id: responseData.messages[0]['message-id'],
					number: responseData.messages[0]['to']
				}

				//Emit to the Client
				io.emit('smsStatus', data);
			}
		}
	)
})

//Define port 
const port = 3000;

//Start server
const server = app.listen(port, () => console.log('Server started on ' + port));

// Connect to Socket.io
const io = socketio(server);
io.on('connection', (socket) => {
	console.log('Connected');
	io.on('disconnect', () => {
		console.log('Disconnected');
	})
})













