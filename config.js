var exports = module.exports = {};

if (!process.env.BASE_URL || !process.env.HOST) {
	process.env.HOST = 'localhost';
	process.env.PORT = 1337;
	process.env.BASE_URL = 'http://localhost:1337';
}