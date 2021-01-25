/*jslint browser: true*/

/*global console, alert, $, jQuery ,false*/

$(document).ready(function () {
  lax.init()
  "use strict";
  // lax.setup(); // init

  // const updateLax = () => {
  //   lax.update(window.scrollY);
  //   window.requestAnimationFrame(updateLax);
  // };
  // window.requestAnimationFrame(updateLax);



  let faceBookBtn = document.getElementById("loginWithFB");
  if (faceBookBtn) {
    faceBookBtn.addEventListener("click", logInWithFacebook);
  }
  function logInWithFacebook() {
    FB.login(
      response => {
        const {
          authResponse: { accessToken, userID }
        } = response;
        console.log(response.authResponse);

        fetch("/loginWithFB", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ accessToken, userID })
        })
          .then(res => {
            console.log(res);

          })
      },
      { scope: "email" }
    );


    return false;

  }

  // Shuffle Cards
  $("#shuffle-cards .shuffle-cards_item").on("click", function () {
    var zIndex = 0;

    $(this).animate({
      marginLeft: 80,
      marginTop: 30
    }, 400, function () {
      zIndex--;
      $(this).css("z-index", zIndex);
    }).animate({
      marginLeft: 0,
      marginTop: 0
    });
  });


  $("#shuffle-cards .shuffle-cards_item a").on("click", e => {
    e.stopPropagation();
  });

  $(".categories-items").css({ display: "block" });

  // Accordion Effect
  $(".categories h4").on("click", function () {
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

  $("#sideNavIcon").on("click", function () {
    $("#sideMenu").css({ opacity: "1" });
    $("#sideMenu").css({ right: "0" });

    setTimeout(function () {
      $("#sideMenu .inner").css({ transform: "scale(1)" });
      console.log("Hey");
    }, 500);
  });

  $("#sideMenu").click(function () {
    $("#sideMenu .inner").css({ transform: "scale(0)" });

    setTimeout(function () {
      $("#sideMenu").css({ right: "-100%" });

      console.log("closed");
    }, 300);
  });

  $(".sideMenu_cls").on("click", () => {
    $("#sideMenu .inner").css({ transform: "scale(0)" });

    setTimeout(function () {
      $("#sideMenu").css({ opacity: "0" });
      $("#sideMenu").css({ right: "-100%" });

      console.log("closed");
    }, 300);
  });

  $("#sideMenu .inner").click(function (e) {
    e.stopPropagation();
  });

  // $(".slider").slick({
  //   autoplay: true,
  //   autoplaySpeed: 3500,
  //   mobileFirst: true,
  //   arrows: false,
  //   speed: 900
  // });

  // var screenWidth = screen.width;

  $(".slider-items").slick({
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
          slidesToShow: 10,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 1990,
        settings: {
          slidesToShow: 8,
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
        breakpoint: 370,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
  });

  //Show&Hide Password
  $(function () {
    "use strict";
    $("#passStatus").click(function (e) {
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


});

const unlike = link => {
  const item = link.parentNode.querySelector("shuffle-cards_item");
  const movieId = link.parentNode.querySelector("[name=movieId]").value;

  fetch(`/movie/${movieId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json"
    }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Removing Movie failed...");
      } else {
        $(link)
          .parents(".shuffle-cards_item")
          .remove();
          if($('.shuffle-cards_item').length == 0){
            $('#shuffle-cards').append("<h3>You Don't Liked Any Movie Yet!!</h3>")
          }
        return res.json();
      }
    })
    .then(resData => {
      console.log(``);
    })
    .catch(err => {
      console.log('Somthing Went Worng!!');
    });
};