"jQuery" in window && (function($) {
    $(function() {
        // Example:
        // $(".roll").rollover();
        // $(".roll, #globalNav").rollover();
        // $(".rollover").rollover({ disable: ".unroll" });
        
        $(".roll").rollover({ disable: ".unroll" });
        $(".roll-test").rollover({ hoverSuffix: "_on" });
        
    })
}(jQuery));

