var Charts = {
    _HYPHY_REGEX: /-([a-z])/g,
    _cleanAttr: function(t) {
        delete t.chart,
        delete t.value,
        delete t.labels
    },
    doughnut: function(element) {
        var attrData = $.extend({}, $(element).data())
          , data = eval(attrData.value);
        Charts._cleanAttr(attrData);
        var options = $.extend({
            responsive: !0,
            animation: !1,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            percentageInnerCutout: 80
        }, attrData);
        new Chart(element.getContext("2d")).Doughnut(data, options)
    },
    bar: function(element) {
        var attrData = $.extend({}, $(element).data())
          , data = {
            labels: eval(attrData.labels),
            datasets: eval(attrData.value).map(function(t, e) {
                return $.extend({
                    fillColor: e % 2 ? "#42a5f5" : "#1bc98e",
                    strokeColor: "transparent"
                }, t)
            })
        };
        Charts._cleanAttr(attrData);
        var options = $.extend({
            responsive: !0,
            animation: !1,
            scaleShowVerticalLines: !1,
            scaleOverride: !0,
            scaleSteps: 4,
            scaleStepWidth: 25,
            scaleStartValue: 0,
            barValueSpacing: 10,
            scaleFontColor: "rgba(0,0,0,.4)",
            scaleFontSize: 14,
            scaleLineColor: "rgba(0,0,0,.05)",
            scaleGridLineColor: "rgba(0,0,0,.05)",
            barDatasetSpacing: 2
        }, attrData);
        new Chart(element.getContext("2d")).Bar(data, options)
    },
    line: function(element) {
        var attrData = $.extend({}, $(element).data())
          , data = {
            labels: eval(attrData.labels),
            datasets: eval(attrData.value).map(function(t) {
                return $.extend({
                    fillColor: "rgba(66, 165, 245, .2)",
                    strokeColor: "#42a5f5",
                    pointStrokeColor: "#fff"
                }, t)
            })
        };
        Charts._cleanAttr(attrData);
        var options = $.extend({
            animation: !1,
            responsive: !0,
            bezierCurve: !0,
            bezierCurveTension: .25,
            scaleShowVerticalLines: !1,
            pointDot: !1,
            tooltipTemplate: "<%= value %>",
            scaleOverride: !0,
            scaleSteps: 3,
            scaleStepWidth: 1e3,
            scaleStartValue: 2e3,
            scaleLineColor: "rgba(0,0,0,.05)",
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleFontColor: "rgba(0,0,0,.4)",
            scaleFontSize: 14,
            scaleLabel: function(t) {
                return t.value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
            }
        }, attrData);
        new Chart(element.getContext("2d")).Line(data, options)
    },
    "spark-line": function(element) {
        var attrData = $.extend({}, $(element).data())
          , data = {
            labels: eval(attrData.labels),
            datasets: eval(attrData.value).map(function(t) {
                return $.extend({
                    fillColor: "rgba(255,255,255,.3)",
                    strokeColor: "#fff",
                    pointStrokeColor: "#fff"
                }, t)
            })
        };
        Charts._cleanAttr(attrData);
        var options = $.extend({
            animation: !1,
            responsive: !0,
            bezierCurve: !0,
            bezierCurveTension: .25,
            showScale: !1,
            pointDotRadius: 0,
            pointDotStrokeWidth: 0,
            pointDot: !1,
            showTooltips: !1
        }, attrData);
        new Chart(element.getContext("2d")).Line(data, options)
    }
};

$(document).ready(function () {
  $(document).on("redraw.bs.charts", function() {
    $("[data-chart]").each(function() {
      $(this).is(":visible") && Charts[$(this).attr("data-chart")](this)
    })
  }).trigger("redraw.bs.charts")
})

;(function (exports, $) {
  var socket = io.connect('http://io.emi.ai/lab')

  function ii(s, len, padding) {
    len = len || 2
    padding = padding || '0'
    s = s.toString()
    while (s.length < len) {
      s = padding + s
    }
    return s
  }

  function fromNow(ts) {
    var now = Date.now()
    var ss = Math.round((now - ts) / 1000)
    if (ss > 60 * 60) {
      // over 1 hour
      //return moment(ss).format('HH:mm:ss')
      var t = new Date(ts)
      var hh = t.getHours()
      var mm = t.getMinutes()
      var ss = t.getSeconds()
      return ii(hh) + ':' + ii(mm) + ':' + ii(ss)
    } else {
      var m = parseInt(ss / 60)
      var s = ss % 60
      var stime = ''
      if (m) {
        stime += m.toString() + 'm'
      }
      if (!(m && !s)) {
        stime += s + 's'
      }
      stime += ' ago'
      return stime
    }
  }

  function message(type, msg, keep) {
    $('#site-message').text(msg).show()
    if (!keep) {
      $('#site-message').delay(2000).fadeOut()
    }
  }

  var newTemperature = (function () {
    var temp_datas = {}
    var temp_labels = {}
    return function (t, id) {
      if (!temp_datas[id]) {
         temp_datas[id] = []
         temp_labels[id] = []
      }
      temp_datas[id].push(t)
      temp_labels[id].push(temp_datas[id].length.toString())
      var l = $('#sparkline' + id.toString())
      l.data('value', [{data: temp_datas[id]}])
      l.data('labels', temp_labels[id])
      l.trigger('redraw.bs.charts')

      // update main value
      var index = id - 1
      $('#chart-temperature h2 > .value:eq(' + index + ')').text(t.toFixed(1))
    }
  })()

  var diff_ts = false
  function log(s, ts, escaped) {
    if (diff_ts === false) {
      diff_ts = Date.now() - ts
    }
    var now = ts ? new Date(ts + diff_ts) : new Date()
    var tips = now.toString() // now.format("dddd, MMMM Do YYYY, h:mm:ss A")
    var stime = fromNow(now.valueOf())

    // var logscount = $('#table-log > .ph').length
    // if (logscount > 20) {
    //   $('#table-log > .ph:last').remove()
    // }

    var m = s.match(/\stemp\:([0-9\.]+)/)
    var m2 = s.match(/id\:([0-9]+)/)
    if (m && m2) {
      newTemperature(parseFloat(m[1]), parseInt(m2[1]))
    }

    $('#table-log > .table-title .no-data').hide()
    $('#table-log > h4').after(
      '<a class="table-row" href="javascript:void(0)">\n'
       + '<span data-timestamp="' + now.valueOf() + '" title="' + tips + '" class="moment float-right">' + stime + '</span>\n'
       + s + '\n'
       + '</a>\n'
    )
  }

  // moment update
  var t_moment_update = setInterval(function () {
    var $elms = $('.moment')
    $elms.each(function (i, m) {
      var $elm = $(m)
      var ts = parseInt($elm.data('timestamp'))
      if (ts) {
        var timefromnow = fromNow(ts)
        $elm.text(timefromnow)
        if (~timefromnow.indexOf(':')) {
          $elm.removeClass('moment')
        }
      }
    })
  }, 1000)

  $(window).bind('beforeunload', function() {
    socket.disconnect()
  })
  // socket event
  socket.on('connect', function () {
    $('#site-status').hide()
    console.log('socket.io connected')
  })
  socket.on('reconnect', function () {
    $('#site-status').hide()
    message('System', 'Reconnected')
  })
  socket.on('reconnecting', function () {
    $('#site-status').text('OFFLINE').show()
    message('System', 'Reconnecting')
  })
  socket.on('error', function (e) {
    message('System', e ? e : 'A unknown error occurred', true)
  })
  // log event
  socket.on('log', function (s) {
    if (s && s.info) {
      console.log('log', s)
      log(s.info, s.time)
    }
  })

  // get latest records
  $.ajax({
    url: 'http://io.emi.ai/record/get',
    dataType: 'json',
    success: function (data) {
      if (data && data.code === 200) {
        var records = data.records
        if (diff_ts === false) {
          diff_ts = 0
        }
        for (var i = records.length - 1; i >= 0; i--) {
          log(records[i].data, parseInt(records[i].time) * 1000)
        }
      }
    },
  })

  exports.callLog = log
  exports.newTemperature = newTemperature
})(window, jQuery)
