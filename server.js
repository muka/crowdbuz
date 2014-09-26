/*
 * The MIT License
 *
 * Copyright 2014 Luca Capra <luca.capra@create-net.org>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var express = require("express"),
        app = express(),
        bodyParser = require('body-parser'),
        errorHandler = require('errorhandler'),
        methodOverride = require('method-override'),

        restler = require('restler'),
        reproject = require('reproject'),
        proj4js = require('proj4'),
        proj4jsdef = require('proj4js-defs')(proj4js),

        port = parseInt(process.env.PORT, 10) || 4567;

app.get("/", function (req, res) {
    res.redirect("/index.html");
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

console.log("Simple static server listening at http://localhost:" + port);
app.listen(port, '0.0.0.0');


var sasaUrls = {
    positions: "http://realtime.opensasa.info/positions",
//    vdv: "http://opensasa.info/SASAplandata/?type=REC_FRT&LI_NR=1005&TAGESART_NR=66",
    stops: "http://opensasa.info/SASAplandata/?type=REC_ORT",
};

app.get("/api/sasa/:req", function(req, res) {

    switch (req.params.req) {
        case "positions":

            // ?lines=
            restler.json(sasaUrls.positions).on('complete', function(j) {
                var prjson = reproject.reproject(j, 'EPSG:25832',  proj4js.WGS84, proj4js.defs);
                res.send(prjson);
            });

            break;
        case "stops":

            var url = sasaUrls.stops;

            restler.json(url).on('complete', function(j) {

                var feat = {
                    "type": "Feature",
                    "geometry": null,
                    "properties": {
                    }
                };

                var deepcopy = function(v) { return JSON.parse(JSON.stringify(v)); };

                var featcoll =   {
                    "type": "FeatureCollection",
                    "features": []
                };

//                console.log(j);
                j.forEach(function(stop) {

                    stop.busstops.forEach(function(pos) {
                        var f = deepcopy(feat);
                        f.properties = {
                            id: pos.OPT_NR,
                            name: stop.ORT_NAME,
                            area: stop.ORT_GEMEINDE
                        };
                        f.geometry = {
                            type: "Point",
                            coordinates: [ pos.ORT_POS_LAENGE, pos.ORT_POS_BREITE ]
                        };

                        featcoll.features.push(f);
                    });

                });

                res.send(featcoll);
            });

            break;
        case "vdv":

            // ?lines=
            var url = sasaUrls.vdv;

            restler.json(url).on('complete', function(j) {
                var prjson = reproject.reproject(j, 'EPSG:25832',  proj4js.WGS84, proj4js.defs);
                res.send(prjson);
            });

            break;
        default:
            res.send(404);
            break;
    }


});

