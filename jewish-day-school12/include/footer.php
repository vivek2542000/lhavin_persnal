<div class="travel-need">
  <div class="container">
    
    <div class="row">
      <div class="col-md-4 white-cl">
        <h4>Address</h4>
        <p>Jewish Day School, Canada</p>
        <div class="">
          <p><i class="fa fa-map-marker mr-5"></i>Bypass Four Lane Circle, <br>
                A.B.Road, Rairu,
                Gwalior<br>
                Madhya Pradesh, India 474005</p>
        </div>
      </div>
        <div class="col-md-4">
          <h4>Contact Us</h4>
          <ul class="category">
            <li><a href="#"><i class="fa fa-envelope mr-5"></i>user@gmail.com</a>
            </li>
            <li><a href="#"><i class="fa fa-phone"></i>+91 9765486532</a>
            </li>
          </ul>
        </div>

      <div class="col-md-4 text-right">
        <img src="images/logo-new.jpg">
      </div>
    </div>
  </div>
</div>
<!-----------------Modal Login-------------------------->

<!-----------------Modal Login Ends-------------------------->
<!-----------------Modal Signup-------------------------->

<!-----------------Modal Signup Ends-------------------------->
<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>  -->
<script src="https://kit.fontawesome.com/113b70814b.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<script src="js/slick.js"></script>
<script src="js/jquery.flagstrap.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.6.2/js/bootstrap-select.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/noisy/1.2/jquery.noisy.min.js"></script>
 <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&amp;sensor=false"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.9/js/intlTelInput.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.9/js/intlTelInput.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.9/js/utils.js"></script>
   
   
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-touchspin/4.2.5/jquery.bootstrap-touchspin.min.js"></script>
  <script>
    jQuery(document).ready(function () {
        jQuery('#datepicker').datepicker({
            format: 'dd-mm-yyyy',
            startDate: '+1d'
        });
    });
  </script>
  <script>
    $("input[class='touchspin']").TouchSpin();
  </script>
   <script>
    
var telInput = $("#phone"),
  errorMsg = $("#error-msg"),
  validMsg = $("#valid-msg");

// initialise plugin
telInput.intlTelInput({

  allowExtensions: true,
  formatOnDisplay: true,
  autoFormat: true,
  autoHideDialCode: true,
  autoPlaceholder: true,
  defaultCountry: "in",
  ipinfoToken: "yolo",

  nationalMode: false,
  numberType: "MOBILE",
  //onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
  preferredCountries: ['in', 'ae', 'qa','om','bh','kw','ma'],
  preventInvalidNumbers: true,
  separateDialCode: true,
  initialCountry: "in",
  geoIpLookup: function(callback) {
  $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
    var countryCode = (resp && resp.country) ? resp.country : "";
    callback(countryCode);
  });
},
   utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.9/js/utils.js"
});

var reset = function() {
  telInput.removeClass("error");
  errorMsg.addClass("hide");
  validMsg.addClass("hide");
};

// on blur: validate
telInput.blur(function() {
  reset();
  if ($.trim(telInput.val())) {
    if (telInput.intlTelInput("isValidNumber")) {
      validMsg.removeClass("hide");
    } else {
      telInput.addClass("error");
      errorMsg.removeClass("hide");
    }
  }
});

// on keyup / change flag: reset
telInput.on("keyup change", reset);



  </script>
<script>
  $(function(){
      $('.selectpicker').selectpicker();
  });
</script>
<script>
  $("#single").select2({
            placeholder: "Select",
            allowClear: true
        });
  $("#currency").select2({
            placeholder: "Select",
            allowClear: true
        });
        $("#language").select2({
            placeholder: "Select",
            allowClear: true
        });
        $("#language-2").select2({
            placeholder: "Select",
            allowClear: true
        });
         $("#country").select2({
            placeholder: "Select",
            allowClear: true
        });
         $("#country-2").select2({
            placeholder: "Select",
            allowClear: true
        });
</script>
<!--  <script src="https://www.jqueryscript.net/demo/jQuery-Plugin-For-Country-Selecter-with-Flags-flagstrap/dist/js/jquery.flagstrap.js"></script> -->
<!-------------Acoordian JS--------------->
<script>
  $(document).ready(function() {
    $(".set > a").on("click", function() {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $(this)
          .siblings(".content")
          .slideUp(200);
        $(".set > a i")
          .removeClass("fa-angle-down")
          .addClass("fa-angle-up");
      } else {
        $(".set > a i")
          .removeClass("fa-angle-down")
          .addClass("fa-angle-up");
        $(this)
          .find("i")
          .removeClass("fa-angle-up")
          .addClass("fa-angle-down");
        $(".set > a").removeClass("active");
        $(this).addClass("active");
        $(".content").slideUp(200);
        $(this)
          .siblings(".content")
          .slideDown(200);
      }
    });
  });
</script>
<!---------------------Country dropdown js-------------->
<script>
  $('#basic').flagStrap();
  
  $('.select-country').flagStrap({
      countries: {
          "US": "USD",
          "AU": "AUD",
          "CA": "CAD",
          "SG": "SGD",
          "GB": "GBP",
      },
      buttonSize: "btn-sm",
      buttonType: "btn-info",
      labelMargin: "10px",
      scrollable: false,
      scrollableHeight: "350px"
  });
  
  $('#advanced').flagStrap({
      buttonSize: "btn-lg",
      buttonType: "btn-primary",
      labelMargin: "20px",
      scrollable: false,
      scrollableHeight: "350px"
  });
</script>
</body>

</html>