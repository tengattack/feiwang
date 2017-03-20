// statistic
$(document).ready(function () {
  $(".scroll").click(function(event) {
      event.preventDefault();
      $('html,body').animate({
          scrollTop: $(this.hash).offset().top
      }, 1000);
  });
  /*
  var defaults = {
      containerID: 'toTop', // fading element id
    containerHoverID: 'toTopHover', // fading element hover id
    scrollSpeed: 1200,
    easingType: 'linear'
  };
  */
  $().UItoTop({
      easingType: 'easeOutQuart'
  });

  $.ajax({
    type: 'POST',
    url: 'http://io.emi.ai/record/access',
    data: { key: 'feiwang' },
    dataType: 'json',
    success: function (data) {
      if (data && data.code === 200) {
        $('.statistic-count').text(data.access.count);
      }
    },
  })
})
