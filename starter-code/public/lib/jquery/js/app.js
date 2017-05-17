

$(document).ready(function () {
  console.log('DOM Tree online');
  $('li:contains(Menu 1)').addClass('selected');
  $('article:contains(Article 2)').addClass('middle');
  $('article:contains(Article 5)').addClass('middle');
  $('.list-item:even').addClass('highlighted');
  $('.list-item:contains(Element 5)').css({'border':'1px solid #eee'});
  $(':focus').toggleClass('focused');
  });
