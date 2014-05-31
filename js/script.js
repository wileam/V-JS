// created by wileam. 2014-05-31
$(document).ready(function() {
  //click links
  $('.nav.nav-list a').on('click', function(event) {
    $('#sidebar').find('.active').removeClass('active');
    $(this).parent('li').addClass('active');
  });
});