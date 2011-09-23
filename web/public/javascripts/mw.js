$(document).ready(function() {
  //footer code
  var shown = false;
  var $footer = $('#footer');  
  var $leaf = $('#leaf').click(function() {
    if (shown) { hideFooter(); }
    else { showFooter(); }
  });
  function hideFooter() {
     $footer.slideUp();
     $leaf.animate({bottom: '0px'}, 'normal');
     shown = false;
  }
  function showFooter() {
     $footer.slideDown();
     $leaf.animate({bottom: '35px'}, 'normal');
     shown = true;
  }
  $(document).keydown(function(e) {
     if (e.keyCode == 27 && shown) { hideFooter(); }
  });
});