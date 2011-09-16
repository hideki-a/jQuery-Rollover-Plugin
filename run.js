"jQuery" in window && (function($) {
    $(function() {
        // Example:
        // $(".roll").rollover();
        // $(".roll, #globalNav").rollover();
        // $(".rollover").rollover({ disable: ".unroll" });
        
        $(".roll").rollover({ disable: ".unroll" });
        $(".roll-test").rollover({ replaceStr: "_on$1" });
        $(".roll-test2").rollover({
            replaceCond: /(_a)?(\.[^\.]+)$/,
            replaceStr: "_o$2"
        });
    });
}(jQuery));

