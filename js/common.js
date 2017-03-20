// statistic
$(document).ready(function () {
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
