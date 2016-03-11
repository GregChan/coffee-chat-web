var exports = module.exports = {};

if (!process.env.BASE_URL || !process.env.HOST) {
	process.env.HOST = 'localhost';
	process.env.PORT = 1337;
	process.env.BASE_URL = 'http://localhost:1337';
}

if (!process.env.DB_HOST || !process.env.DB_PASS || !process.env.DB_USER || !process.env.DB_COFFEE_CHAT) {
	process.env.DB_HOST = "us-cdbr-azure-central-a.cloudapp.net";
	process.env.DB_PASS = "4d39195d";
	process.env.DB_USER = "b443fc80dd2566";
	process.env.DB_COFFEE_CHAT = "coffeechat";
}

if (!process.env.PASSWORD || !process.env.USERNAME) {
	process.env.PASSWORD = "NUvention2016!";
	process.env.USERNAME = "GoCoffeeChat";
}