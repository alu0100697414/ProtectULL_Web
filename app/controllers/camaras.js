/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('underscore');
var Camara = require('../../app/models/camara');
var Historial = require('../../app/models/historial_conexiones');
var Utilities = require('./utilities');

var error = {'response' : 404};
var error_400 = {'response' : 400};
var error_400_1 = {'responseEO' : 400};
var ok = {'response' : 201};

/* Views Responce */
exports.index = function (req, res) {
    res.render('camaras');
};

exports.addindex = function (req, res) {
    res.render('add_camara');
};

exports.listindex = function (req, res) {
    res.render('list_camara');
};

exports.historialindex = function (req, res) {
    res.render('historial');
};


/************************************************************************************/
/*******    API Responces                                                  **********/
/************************************************************************************/

/* All cams */
exports.getall = function (request, response) {
    Camara.find(function (err, camaras) {
        if (!err) {
            response.send(camaras);
        } else {
            console.log(err);
            response.send(error);
        }
    });
};

/* Get historial */
exports.getHistorial = function (request, response) {
    Historial.find(function (err, historiales) {
        if (!err) {
            response.send(historiales);
        } else {
            console.log(err);
            response.send(error);
        }
    });
};

/* Borrar historial de conexiones */
exports.deleteHistorial = function (request, response) {
  Historial.remove({}, function (err) { });
};

/* All cams */
exports.getalllive = function (request, response) {
    Camara.find({online : true}, function (err, camaras) {
        if (!err) {
            response.send(camaras);
        } else {
            console.log(err);
            response.send(error);
        }
    });
};

/* Delete */
exports.delete = function (request, response) {
    if ( Utilities.isEmpty(request.params.id)) return response.send(error_400);
    Camara.findOne({_id: request.params.id}, function (err, camara) {
        if (err) return response.send(error);
        if (Utilities.isEmpty(camara)) return response.send(error);
        camara.remove();
        response.send(ok);
    });
};

/* New camera */
exports.new = function (request, response) {

    if ( Utilities.isEmpty(request.body.name)) return response.send(error_400);
    if ( Utilities.isEmpty(request.body.server)) return response.send(error_400);

    Camara.find({name: request.body.name}).exec(function (err, camaras) {

        if (err) return response.send(error);
        if (!Utilities.isEmpty(camaras)) return response.send(error);

        var server = "rtmp://" + request.body.server + request.body.name;
        var camaranueva = new Camara({ server: server, name: request.body.name});
        camaranueva.save();

        response.send(ok);
    });

};

/* ¿on Live? */
exports.getisonline = function (request, response) {
    if (Utilities.isEmpty(request.params.id)) return response.send(error_400);
    Camara.findOne({_id: request.params.id}, function (err, camara) {
        if (err) return response.send(error);
        if (Utilities.isEmpty(camara)) return response.send(error);
        response.send(camara.online);
    });
};

/* on Live */
exports.putonline = function (request, response) {

    if (Utilities.isEmpty(request.params.name)) return response.send(error_400);

    if ( Utilities.isEmpty(request.body.name)) return response.send(error_400);
    if (Utilities.isEmpty(request.body.server)) return response.send(error_400);
    if (Utilities.isEmpty(request.body.time_now)) return response.send(error_400_);

    Camara.find({name: request.params.name}).exec(function (err, camara) {

        if (err) response.send(error_400);
        if (Utilities.isEmpty(camara)) return response.send(error_400);

        camara[0].online = true;
        camara[0].save();

        Historial.find({name: request.body.name}).exec(function (err, historiales) {
            if (err) return response.send(error);

            var server = "rtmp://" + request.body.server + request.body.name;
            var historial_nuevo = new Historial({ server: server, name: request.body.name, time: request.body.time_now });
            historial_nuevo.save();

            response.send(ok);
        });
    });
};

/* off Live  */
exports.putoffline = function (request, response) {
    if (Utilities.isEmpty(request.params.name)) return response.send(error_400);
    Camara.find({name: request.params.name}).exec(function (err, camara) {
        if (err) response.send(error_400);
        if (Utilities.isEmpty(camara)) return response.send(error_400);
        camara[0].online = false;
        camara[0].save();
        response.send(ok);
    });
};
