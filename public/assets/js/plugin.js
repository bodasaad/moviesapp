/*jslint browser: true*/

/*global console, alert, $, jQuery ,false*/

window.onload = function() {
  lax.setup(); // init

  const updateLax = () => {
    lax.update(window.scrollY);
    window.requestAnimationFrame(updateLax);
  };

  window.requestAnimationFrame(updateLax);
};

$(window).on("load", () => {
  $(".loader").addClass("activeted");
});
$(document).ready(function() {
  "use strict";

  $(".categories-items").css({ display: "block" });

  // Accordion Effect
  $(".categories h4").on("click", function() {
    $(this)
      .addClass("active")
      .siblings()
      .removeClass("active");
    $(this)
      .next()
      .slideToggle(500);
    $(".categories div")
      .not($(this).next())
      .slideUp(500);
  });

  // Slick Sliders

  $(document).ready(function() {
    $(".slider").slick({
      autoplay: true,
      autoplaySpeed: 3500,
      mobileFirst: true,
      arrows: false,
      speed: 900
    });

    $(".category-slider").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      centerPadding: "40px",
      arrows: false,
      adaptiveHeight: true,
      autoplay: true,
      autoplaySpeed: 2000,
      appendDots: $(".category-slider")
    });

    $(".sideMenu_cls").on("click", () => {
      $("#sideMenu").css({ top: "-100%" });
    });
  });

  // Shuffle Cards
  var zIndex = 0;
  $("#shuffle-cards .shuffle-cards_item").on("click", function() {
    $(this)
      .animate(
        {
          marginLeft: 80,
          marginTop: 30
        },
        400,
        function() {
          zIndex--;
          $(this).css("z-index", zIndex);
        }
      )
      .animate(
        {
          marginLeft: 0,
          marginTop: 0
        },
        700
      );
  });

  $("#sideNavIcon").on("click", function() {
    $("#sideMenu").css({ top: "0" });
  });
  $("#sideMenu").click(function() {
    $(this).css({ top: "-100%" });
  });
  $("#sideMenu .inner").click(function(e) {
    e.stopPropagation();
  });
});

//Show&Hide Password
$(function() {
  "use strict";
  $("#passStatus").click(function(e) {
    e.preventDefault();
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $("#password").attr("type", "text");
    } else {
      $("#password").attr("type", "password");
    }
  });
});

function myFunction() {
  let x = "Total Widht: " + screen.width + "px";
  document.getElementById("demo").innerHTML = x;
}

const unlike = link => {
  const movieId = link.parentNode.querySelector("[name=movieId]").value;
  fetch(`/movie/${movieId}`, {
    method: "POST"
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Changing Quantinty failed...");
      } else {
        return res.json();
      }
    })
    .then(resData => {
      $(link)
      .parents(".horiz-slider-item")
      .fadeOut();
      console.log(`resData is ${resData}`);
    })
    .catch(err =>{
      console.log(err);
      
    });
};
