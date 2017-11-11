'use strict';

let pr_name = pr_name || {};

pr_name = {

    header: {
        sticky: {
            setup: function () {
                if (!$("selector").length) return false;
            }
        },
        setup: function () {
			pr_name.header.sticky.setup();
        }
    },
    init: function () {
		pr_name.header.setup();
    }
};

$(function () {
	pr_name.init();
});