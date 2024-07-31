<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Jewish Day School|Student Sign up</title>
  <link rel="icon" href="images/logo t.png" type="image/x-icon">
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/font-awesome.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="https://www.jqueryscript.net/demo/jQuery-Plugin-For-Country-Selecter-with-Flags-flagstrap/dist/css/flags.css">
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/flexslider/2.7.0/flexslider.min.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/css/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.6.2/css/bootstrap-select.min.css">
  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/0.8.2/css/flag-icon.min.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.9/css/intlTelInput.css" rel="stylesheet" media="screen">
  <link rel="stylesheet" href="css/school.css">
</head>

<body>
  <div class="container">
    <div class="login-form-div" style="margin-top: 5px;">
      <div class="col-md-7 sign-up-form">
        <form>
           <div class="logo text-center">
              <img src="images/logo-new.jpg">
            </div>
              <h5 class="text-center">Student Sign up Form</h5>
             <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>First Name</label>
                        <input type="text" class="form-control" name="">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" class="form-control" name="">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Email Id</label>
                        <input type="Email" class="form-control" name="">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Mobile Number</label>
                        <input type="text" class="form-control" name="">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>School Name</label>
                        <select class="form-control">
                          <option>Select School</option>
                          <option>Jewish Day School</option>
                          <option>Mount Litera School</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Teacher Name</label>
                        <select class="form-control">
                          <option>Select Teacher</option>
                          <option>Sunil Singh</option>
                          <option>Rahul Jain</option>
                          <option>Rajat Singh</option>
                          <option>Nitesh Biswas</option>
                          <option>Pradeep Tomar</option>
                        </select>
                      </div>
                    </div>
                     <div class="col-md-6">
                      <div class="form-group">
                        <label>Class Name</label>
                        <select class="form-control">
                          <option>Select Class</option>
                          <option>Class A</option>
                          <option>Class B</option>
                          <option>Class C</option>
                          <option>Class D</option>
                          <option>Class E</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Enrollment number</label>
                        <input type="text" class="form-control" name="">
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Password</label>
                        <input type="Password" class="form-control" name="">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="Password" class="form-control" name="">
                      </div>
                    </div>
                    <div class="col-md-12 text-center mt-10">
                      <button class="main-btn"><a class="btn-block" href="student-dashboard.php">Sign Up</a></button>
                    </div>
                  </div>
                    <div class="row">
            <div class="col-md-7"> <span class="all-acc">Already have An Account?</span><button><a class="link-btn" href="login.php">&nbsp;Login</a></button>
            </div>
            <div class="col-md-5 text-center">
              <button><a class="link-btn" href="index.php">Back</a></button>
            </div>
          </div>       
        </form>
      </div>
    </div>
  </div>

  <!-----------------modal-----forgot password------------------>
  <div class="modal" id="forgot-password">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-body">
        <h4 class="text-center form-heading">Forgot Password</h4>
        <form>
          <div class="row mt-20">
           
            <div class="col-md-12">
              <div class="form-group">
                <label>Enter E-mail</label>
                <input type="E-mail" name="" class="form-control">
              </div>
            </div>
            <div class="col-md-12 text-center mt-20">
              <button class="main-btn">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
  <!-----------------modal forgot password ends--------------->
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