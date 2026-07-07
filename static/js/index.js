/**
 * Main JS file for GhostScroll behaviours
 */

var $post = $(".post");
var $first = $(".post.first");
var $last = $(".post.last");
var $fnav = $(".fixed-nav");
var $postholder = $(".post-holder");
var $sitehead = $("#site-head");
var $fnItems = $(".fn-item");

/* Globals jQuery, document */
(function ($) {
  "use strict";
  function srcTo(el, dur) {
    if (dur === undefined) { dur = 1000; }
    if (!el || !el.length) { return; }
    $("html, body").animate(
      {
        scrollTop: el.offset().top,
      },
      dur,
      function() {
        window.location.hash = el.attr("id");
      }
    );
  }
  function srcToAnchorWithTitle(str) {
    var $el = $("#" + str);
    if ($el.length) {
      srcTo($el);
    }
  }
  $(document).ready(function () {
    // Set item_index once on load (not on every scroll)
    $post.each(function () {
      var t = $(this).parent(".post-holder").index() + 1;
      $(this).attr("item_index", t);
    });

    // fallback to jQuery animate if smooth scrolling is not supported
    if (!("scrollBehavior" in document.documentElement.style)) {
      // Cover buttons
      $("a.btn.site-menu").click(function (e) {
        e.preventDefault();
        srcToAnchorWithTitle($(this).data("title-anchor"));
      });

      // cover arrow button
      $("#header-arrow").click(function (e) {
        e.preventDefault()
        srcTo($first);
      });
    }

    $(".post.last").next(".post-after").hide();

    if ($sitehead.length) {
      var scrollTicking = false;
      $(window).scroll(function () {
        if (!scrollTicking) {
          window.requestAnimationFrame(function () {
            var w = $(window).scrollTop();
            var g = $sitehead.offset().top;
            var h = $sitehead.offset().top + $sitehead.height() - 100;

            if (w >= Math.floor(g) && w <= Math.ceil(h)) {
              $fnav.fadeOut("fast");
            } else {
              $fnav.css("display", "flex").fadeIn("fast");
            }

            $post.each(function () {
              var idx = $(this).attr("item_index");
              if (($(window).height() + w) > ($(document).height() - $(".site-footer").height())) {
                var l = $postholder.length;
                $fnItems.removeClass("active").removeAttr("aria-current");
                $fnItems.filter("[item_index='" + l + "']").addClass("active").attr("aria-current", "true");
              } else {
                var f = $(this).offset().top;
                var b = $(this).offset().top + $(this).height();
                var i = $fnItems.filter("[item_index='" + idx + "']");
                var a = $(this)
                  .parent(".post-holder")
                  .prev(".post-holder")
                  .find(".post-after");

                if (w >= f && w <= b) {
                  i.addClass("active").attr("aria-current", "true");
                  a.fadeOut("slow");
                } else {
                  i.removeClass("active").removeAttr("aria-current");
                  a.fadeIn("slow");
                }
              }
            });

            scrollTicking = false;
          });
          scrollTicking = true;
        }
      });
    }

    // Scope list/blockquote decoration to post content only
    $(".post-content ul").addClass("fa-ul");
    $(".post-content ul li").prepend('<span class="fa-li"><i class="fa fa-asterisk"></i></span>');
    $(".post-content blockquote p").prepend('<span class="quo fa fa-quote-left"></span>');
    $(".post-content blockquote p").append('<span class="quo fa fa-quote-right"></span>');
  });

  // Optimised icon replacement: single pass with combined regex
  $post.each(function () {
    var $this = $(this);
    var html = $this.html();
    var replaced = html.replace(/@(fa-[a-z0-9-]+)@/g, '<i class="fa $1"></i>');
    if (replaced !== html) {
      $this.html(replaced);
    }
  });
})(jQuery);
