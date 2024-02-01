function mouseTileMove(containerSelector, imageSelector) {
    $(containerSelector)
        .on("mouseover", function () {
            $(this)
                .children(imageSelector)
                .css({
                    transform: "scale(" + $(this).attr("data-scale") + ")"
                });
        })
        .on("mouseout", function () {
            $(this).children(imageSelector).css({
                transform: "scale(1)"
            });
        })
        .on("mousemove", function (e) {
            $(this)
                .children(imageSelector)
                .css({
                    "transform-origin": ((e.pageX - $(this).offset().left) / $(this).width()) * 100 +
                        "% " +
                        ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +
                        "%",
                });
        });
}