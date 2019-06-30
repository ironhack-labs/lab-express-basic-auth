exports.getHome = (req, res, next) => {
	res.render("index");
};

exports.getMain = (req, res, next) => {
	res.render("main");
};

exports.getPrivate = (req, res, next) => {
	res.render("private");
};
