/*jslint browser: true*/

/*global console, alert, $, jQuery ,false*/




$(document).ready(function() {
  "use strict";
  lax.setup(); // init

  const updateLax = () => {
    lax.update(window.scrollY);
    window.requestAnimationFrame(updateLax);
  };
  window.requestAnimationFrame(updateLax);
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

  $("#shuffle-cards .shuffle-cards_item a").on("click", function(e) {
    e.stopPropagation();
  });

  $("#sideNavIcon").on("click", function() {
    
    $('#sideMenu').css({ opacity: "1" });
    $("#sideMenu").css({ right: "0" });

    setTimeout(function() {
      $("#sideMenu .inner").css({ transform: "scale(1)" });
      console.log("Hey");
    }, 500);
  });

  $("#sideMenu").click(function() {
    $("#sideMenu .inner").css({ transform: "scale(0)" });

    setTimeout(function() {
      $('#sideMenu').css({ right: "-100%" });
      
      console.log("closed");
    }, 300);
  });

  $(".sideMenu_cls").on("click", () => {
    $("#sideMenu .inner").css({ transform: "scale(0)" });

    setTimeout(function() {
      
      $('#sideMenu').css({ opacity: "0" });
      $('#sideMenu').css({ right: "-100%" });
      
      console.log("closed");
    }, 300);
  });

  $("#sideMenu .inner").click(function(e) {
    e.stopPropagation();
  });




$(".slider").slick({
  autoplay: true,
  autoplaySpeed: 3500,
  mobileFirst: true,
  arrows: false,
  speed: 900
});

// var screenWidth = screen.width;


$(".category-slider").slick({
  speed: 300,
  centerPadding: "40px",
  arrows: true,
  autoplay: true,
  autoplaySpeed: 15000,
  adaptiveHeight: true,
  responsive: [
    {
      breakpoint: 2690,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 1990,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 1440,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },

    {
      breakpoint: 375,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
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
  const item = link.parentNode.querySelector("shuffle-cards_item");

  const movieId = link.parentNode.querySelector("[name=movieId]").value;
  console.log("Id is:" + movieId);

  fetch(`/movie/${movieId}`, {
    method: "POST"
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Changing Quantinty failed...");
      } else {
        $(link)
          .parents(".shuffle-cards_item")
          .remove();
        return res.json();
      }
    })
    .then(resData => {
      console.log(`resData is ${resData}`);
    })
    .catch(err => {
      console.log(err);
    });
};

  
}); 