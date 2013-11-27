(function () {
  'use strict';
  angular.module('angularSmoothscroll', []).directive('smoothScroll', [
    '$log',
    '$timeout',
    '$window',
    function ($log, $timeout, $window) {
      var currentYPosition, elmYPosition, smoothScroll;
      currentYPosition = function () {
        if ($window.pageYOffset) {
          return $window.pageYOffset;
        }
        if ($window.document.documentElement && $window.document.documentElement.scrollTop) {
          return $window.document.documentElement.scrollTop;
        }
        if ($window.document.body.scrollTop) {
          return $window.document.body.scrollTop;
        }
        return 0;
      };
      elmYPosition = function (eID) {
        var elm, node, y;
        elm = document.getElementById(eID);
        if (elm) {
          y = elm.offsetTop;
          node = elm;
          while (node.offsetParent && node.offsetParent !== document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
          }
          return y;
        }
        return 0;
      };
      smoothScroll = function (eID, offSet) {
        var distance, i, leapY, speed, startY, step, stopY, timer, _results;
        startY = currentYPosition();
        stopY = elmYPosition(eID) - offSet;
        distance = stopY > startY ? stopY - startY : startY - stopY;
        if (distance < 100) {
          scrollTo(0, stopY);
          return;
        }
        speed = Math.round(distance / 100);
        if (speed >= 20) {
          speed = 20;
        }
        step = Math.round(distance / 25);
        leapY = stopY > startY ? startY + step : startY - step;
        timer = 0;
        if (stopY > startY) {
          i = startY;
          while (i < stopY) {
            setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
            leapY += step;
            if (leapY > stopY) {
              leapY = stopY;
            }
            timer++;
            i += step;
          }
          return;
        }
        i = startY;
        _results = [];
        while (i > stopY) {
          setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed);
          leapY -= step;
          if (leapY < stopY) {
            leapY = stopY;
          }
          timer++;
          _results.push(i -= step);
        }
        return _results;
      };
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          return element.bind('click', function () {
            var offset;
            if (attr.target) {
              offset = attr.offset || 100;
              0;
              return smoothScroll(attr.target, offset);
            } else {
              return 0;
            }
          });
        }
      };
    }
  ]).directive('smoothScrollJquery', [
    '$log',
    function ($log) {
      return {
        restrict: 'A',
        link: function (scope, element, attr) {
          return element.bind('click', function () {
            var offset, speed, target;
            if (attr.target) {
              offset = attr.offset || 100;
              target = $('#' + attr.target);
              speed = attr.speed || 500;
              0;
              return $('html,body').stop().animate({ scrollTop: target.offset().top - offset }, speed);
            } else {
              0;
              return $('html,body').stop().animate({ scrollTop: 0 }, speed);
            }
          });
        }
      };
    }
  ]);
}.call(this));