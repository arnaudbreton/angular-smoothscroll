'use strict'

###
A simple AngularJS directive to render a smooth scroll effect
Usage: <element smooth-scroll target='id' [offset='value']></element>
@author: Arnaud BRETON (arnaud@videonot.es)
Inspired by http://www.itnewb.com/tutorial/Create-the-Smooth-Scroll-Effect-with-JavaScript
###
angular.module('angularSmoothscroll', [])
  .directive('smoothScroll', ['$log', '$timeout', '$window', ($log, $timeout, $window) ->
    ###
    Retrieve the current vertical position
    @returns Current vertical position
    ###
    currentYPosition = ->
      # Firefox, Chrome, Opera, Safari
      return $window.pageYOffset  if $window.pageYOffset
      
      # Internet Explorer 6 - standards mode
      return $window.document.documentElement.scrollTop  if $window.document.documentElement and $window.document.documentElement.scrollTop
      
      # Internet Explorer 6, 7 and 8
      return $window.document.body.scrollTop  if $window.document.body.scrollTop
      0
    
    ###
    Get the vertical position of a DOM element
    @param eID The DOM element id
    @returns The vertical position of element with id eID
    ###
    elmYPosition = (eID) ->
      elm = document.getElementById(eID)

      if elm
        y = elm.offsetTop
        node = elm
        while node.offsetParent and node.offsetParent isnt document.body
          node = node.offsetParent
          y += node.offsetTop
        return y
      0
    
    ###
    Smooth scroll to element with a specific ID without offset
    @param eID The element id to scroll to
    @param offSet Scrolling offset
    ###
    smoothScroll = (eID, offSet) ->
      startY = currentYPosition()
      stopY = elmYPosition(eID) - offSet
      distance = (if stopY > startY then stopY - startY else startY - stopY)
      if distance < 100
        scrollTo 0, stopY
        return
      speed = Math.round(distance / 100)
      speed = 20  if speed >= 20
      step = Math.round(distance / 25)
      leapY = (if stopY > startY then startY + step else startY - step)
      timer = 0
      if stopY > startY
        i = startY

        while i < stopY
          # TODO: Using setTimeout with string to slow down animation (with function reference it is too fast)
          # Have not found a proper alternative yet, except using jQuery animate
          setTimeout 'window.scrollTo(0, '+leapY+')', timer * speed

          leapY += step
          leapY = stopY  if leapY > stopY
          timer++
          i += step
        return
      i = startY

      while i > stopY
        # TODO: Using setTimeout with string to slow down animation (with function reference it is too fast)
        # Have not found a proper alternative yet, except using jQuery animate
        setTimeout 'window.scrollTo(0, '+leapY+')', timer * speed

        leapY -= step
        leapY = stopY  if leapY < stopY
        timer++
        i -= step

    restrict: 'A'
    link: (scope, element, attr) ->
      element.bind 'click', ->
        if attr.target
          offset = attr.offset or 100
          $log.log 'Smooth scroll: scrolling to', attr.target, 'with offset', offset
          smoothScroll attr.target, offset
        else
          $log.warn 'Smooth scroll: no target specified'
  ])
  .directive('smoothScrollJquery', ['$log', ($log) ->
    restrict: 'A'
    link: (scope, element, attr) ->
      element.bind 'click', ->
        if attr.target
          offset = attr.offset or 100;
          target = $('#'+attr.target)
          speed = attr.speed or 500
          $log.log 'Smooth scroll jQuery: scrolling to', attr.target, 'with offset', offset, 'and speed', speed
          $('html,body').stop().animate({scrollTop: target.offset().top - offset}, speed)
        else
          $log.log 'Smooth scroll jQuery: no target specified, scrolling to top'  
          $('html,body').stop().animate({scrollTop: 0}, speed);
  ])
