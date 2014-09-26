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

define(['jquery', 'leaflet'], function (jQuery, L) {

    var urls = {
        pos:  '/api/sasa/positions',
        stops:  '/api/sasa/stops',
    };

    var App = function () {

        this.$ = jQuery;
        this.L = L;

        this.layers = {};

        var me = this;
        jQuery(function ($) {

            $(document).foundation();

            var dofit = function () {
                $('.main-section').height($('body').height());
            };
            $(window).resize(dofit);
            dofit();


            me.initialize();

        });
    };

    App.prototype.initialize = function () {

        var me = this;
        var map = this.getMap();

        this.showStops();

        $.getJSON(urls.pos, function (data) {
            me.layers.positions = L.geoJson(data, {
                pointToLayer: function (feature, latlng) {

                    if(!me.positionMarker) {
                        me.positionMarker = {};
                    }

                    var _id = feature.properties.frt_fid;
                    if(me.positionMarker[ _id ]) {
                        me.positionMarker[ _id ].setLatLng(new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]));
                        return me.positionMarker[ _id ];
                    }

                    var marker = new L.CircleMarker( latlng, {
                        radius: 8,
                        fillColor: feature.properties.hexcolor,
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });

                    me.positionMarker[_id] = marker;

                    return marker;
                },
                style: function (feature) {
//                    console.log(feature)
//                    return { color: feature.properties.hexcolor };
                    return { color: feature.properties.hexcolor || 'blue' };
                },
                onEachFeature: function (feature, layer) {
//                    console.log(feature)
                    layer.bindPopup(feature.properties.ort_ref_ort_name);
                }
            }).addTo(map);

            map.setView(me.layers.positions.getBounds().getCenter());
        });

        setInterval(function() {
            $.getJSON(urls.pos, function (data) {
                me.updatePos(data);
            });
        }, 20000);

    };

    App.prototype.updatePos = function (data) {
        var me = this;
        if(!this.layers.positions) return;
        this.layers.positions.addData(data);
    };

    App.prototype.showStops = function () {
        var me = this;
        $.getJSON(urls.stops, function(j) {

            me.layers.stops = L.geoJson(j, {
                pointToLayer: function (feature, latlng) {

                    var marker = new L.CircleMarker( latlng, {
                        radius: 6,
                        fillColor: "purple",
                        color: "purple",
                        weight: 1,
                        opacity: 0.8,
                        fillOpacity: 0.6
                    });

                    return marker;
                },
                style: function (feature) {
                    return { color: 'cyan' };
                },
                onEachFeature: function (feature, layer) {
//                    console.log(feature)
                    layer.bindPopup(feature.properties.name);
                }
            }).addTo(me.getMap());

        });
    };

    App.prototype.getMap = function () {
        if (!this.map) {
            this.map = L.map('map', {
                center: new L.LatLng(46.50016, 671771.35428),
                zoom: 8,
            });
        }

//        this.tile = L.tileLayer.provider('Thunderforest.Landscape').addTo(this.map);
        this.tile = L.tileLayer.provider('OpenStreetMap.Mapnik').addTo(this.map);

        return this.map;
    };

    return new App;

});