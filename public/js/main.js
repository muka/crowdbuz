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

require.config({
    baseUrl: '/js',
    shim: {
        leaflet: {
            export: 'L'
        },
        app: {
            deps: [
                'foundation_offcanvas',
                'leaflet',
                'leaflet_providers'
            ]
        },
        foundation: {
            deps: [ 'jquery'],
            export: 'jQuery.fn.foundation'
        },
        foundation_offcanvas: {
            deps: [ 'foundation'],
        },
        underscore: {
            export: '_'
        },
        leaflet_providers: {
            deps: [ 'leaflet' ]
        }
    },
    paths: {
        'jquery': 'lib/jquery/dist/jquery.min',
        'leaflet': 'lib/leaflet/dist/leaflet-src',
        'leaflet_providers': 'lib/leaflet-providers/leaflet-providers',
        'underscore': 'lib/underscore/underscore-min',
        'foundation': 'lib/foundation/js/foundation.min',
        'foundation_offcanvas': 'lib/foundation/js/foundation/foundation.offcanvas',
    }
});

require([ 'app' ]);