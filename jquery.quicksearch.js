/*jslint white: true, onevar: true, undef: true, newcap: true, nomen: true,
  regexp: false, plusplus: true, bitwise: true, strict: true, browser: true,
  devel: true, maxerr: 50, maxlen: 80, indent: 4
*/
/*global jQuery: false */

(function ($, window, document) {
    "use strict";
    $.fn.quicksearch = function (target, opt) {

        var timeout, cache, rowcache, jq_results, val = '', e = this,
            options = $.extend({
            delay: 100,
            selector: null,
            stripeRows: null,
            loader: null,
            noResults: '',
            bind: 'keyup',
            onBefore: function () {
                return;
            },
            onAfter: function () {
                return;
            },
            show: function () {
                this.style.display = "";
            },
            hide: function () {
                this.style.display = "none";
            },
            prepareQuery: function (val) {
                return val.toLowerCase().split(' ');
            },
            testQuery: function (query, txt, row) {
                for (var i = 0; i < query.length; i += 1) {
                    if (txt.indexOf(query[i]) === -1) {
                        return false;
                    }
                }
                return true;
            }
        }, opt);

        this.go = function () {

            var i = 0, len,
            noresults = true,
            query = options.prepareQuery(val),
            val_empty = (val.replace(' ', '').length === 0);

            for (i = 0, len = rowcache.length; i < len; i += 1) {
                if (val_empty || options.testQuery(query, cache[i],
                            rowcache[i])) {
                    options.show.apply(rowcache[i]);
                    noresults = false;
                } else {
                    options.hide.apply(rowcache[i]);
                }
            }

            if (noresults) {
                this.results(false);
            } else {
                this.results(true);
                this.stripe();
            }

            this.loader(false);
            options.onAfter();

            return this;
        };

        this.stripe = function () {

            if (typeof options.stripeRows === "object" &&
                    options.stripeRows !== null)
            {
                var joined = options.stripeRows.join(' '),
                    stripeRows_length = options.stripeRows.length;

                jq_results.not(':hidden').each(function (i) {
                    $(this).removeClass(joined).addClass(
                        options.stripeRows[i % stripeRows_length]);
                });
            }

            return this;
        };

        this.strip_html = function (input) {
            var output = input.replace(/<[^<]+>/g, "");
            output = $.trim(output.toLowerCase());
            return output;
        };

        this.results = function (bool) {
            if (typeof options.noResults === "string" &&
                    options.noResults !== "") {
                if (bool) {
                    $(options.noResults).hide();
                } else {
                    $(options.noResults).show();
                }
            }
            return this;
        };

        this.loader = function (bool) {
            if (typeof options.loader === "string" && options.loader !== "") {
                if (bool) {
                    $(options.loader).show();
                } else {
                    $(options.loader).hide();
                }
            }
            return this;
        };

        this.cache = function () {

            jq_results = $(target);

            if (typeof options.noResults === "string" &&
                    options.noResults !== "") {
                jq_results = jq_results.not(options.noResults);
            }

            var t = (typeof options.selector === "string") ?
                jq_results.find(options.selector) :
                $(target).not(options.noResults);
            cache = t.map(function () {
                return e.strip_html(this.innerHTML);
            });

            rowcache = jq_results.map(function () {
                return this;
            });

            return this.go();
        };

        this.trigger = function () {
            this.loader(true);
            options.onBefore();

            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                e.go();
            }, options.delay);

            return this;
        };

        this.cache();
        this.results(true);
        this.stripe();
        this.loader(false);

        return this.each(function () {
            $(this).bind(options.bind, function () {
                val = $(this).val();
                e.trigger();
            });
        });

    };

}(jQuery, this, document));

/* vim: set ts=4 sw=4 et: */
