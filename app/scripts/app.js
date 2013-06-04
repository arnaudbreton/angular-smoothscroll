'use strict';

/**
 * A simple AngularJS directive to render a smooth scroll effect
 * Usage: <element smooth-scroll target="id" [offset="value"]></element>
 * @author: Arnaud BRETON (arnaud@videonot.es)
 * Inspired by http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
 */
angular.module('angularSmoothscroll', [])
    .directive('smoothScroll', ['$log', "$timeout", function ($log, $timeout) {
        /**
         * Retrieve the current vertical position
         * @returns Current vertical position
         */
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }

        /**
         * Get the vertical position of a DOM element
         * @param eID The DOM element id
         * @returns The vertical position of element with id eID
         */
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }

        /**
         * Smooth scroll to element with a specific ID without offset
         * @param eID The element id to scroll to
         * @param offSet Scrolling offset
         */
        function smoothScroll(eID, offSet) {
            var startY = currentYPosition();
            var stopY = elmYPosition(eID) - offSet;

            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY); return;
            }

            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;

            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;

            if (stopY > startY) {
                for ( var i=startY; i<stopY; i+=step ) {
                    $timeout("window.scrollTo(0, "+leapY+")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for ( var i=startY; i>stopY; i-=step ) {
                $timeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }
        }
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.bind('click', function () {
                    if(attr.target) {
                        $log.log('Smooth scroll: scrolling to', attr.target, 'with offset', attr.offset);
                        smoothScroll(attr.target, attr.offset || 100);
                    }
                    else {
                        $log.warning('Smooth scroll: no target specified');
                    }
                });
            }
        };
    }]);
