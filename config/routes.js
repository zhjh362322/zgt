var index = require('../routes/index');
var users = require('../routes/users');
var mini = require('../routes/mini');
var user = require('../routes/basic/user');
var company = require('../routes/basic/company');
var plant = require('../routes/basic/plant');
var shipper = require('../routes/basic/shipper');
var quotation = require('../routes/basic/quotation');
var car = require('../routes/basic/car');
var consignment = require('../routes/consignment');
var upload = require('../routes/upload');
module.exports = function(app) {
    app.use('/', index);
    app.use('/users', users);
    app.use('/mini', mini);
    app.use('/basic/user', user);
    app.use('/basic/company', company);
    app.use('/basic/plant', plant);
    app.use('/basic/shipper', shipper);
    app.use('/basic/quotation', quotation);
    app.use('/basic/car', car);
    app.use('/consignment', consignment);
    app.use('/upload', upload);
}