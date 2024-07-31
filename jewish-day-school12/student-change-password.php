<?php include( 'include/student-dashboard-header.php'); ?>
<!----------------COntent start-------------->
<section id="content-wrapper">
  <div class="container-fluid">
    <div class="row p-t-b-20">
      <div class="col-md-12">
        <div class="form-card no-b">
          <div class="login-form-card">
            <!-- <div class="login-form-content"> -->
            <form action="javascript:(0);">
              <h2 class="form-title">Change Password</h2>
             
             
              <!--  <div class="form-define-head">
                <h4><span>step 3</span>Other Links</h4>
              </div> -->
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                        <label for="field" class="hidden-md">Old Password</label>
                          <input type="Password"  placeholder="" class="form-control" name="field[]" />
                       
                      </div>
                </div>
                <div class="col-md-6">
                   <div class="form-group">
                      
                       
                      </div>
                </div>
                 <div class="col-md-6">
                   <div class="form-group">
                        <label for="field" class="hidden-md">New Password</label>
                          <input type="Password" placeholder="" class="form-control" name="field[]" />
                       
                      </div>
                </div>
                 <div class="col-md-6">
                   <div class="form-group">
                        <label for="field" class="hidden-md">Confirm Password</label>
                        <input type="Password" name="" class="form-control">
                       
                      </div>
                </div>
                 <div class="col-md-12 text-center mt-20">
                   <button class="main-btn">Update</button>
                </div>
                
              </div>
            </form>
          </div>
        </div>
        <!--  </div> -->
      </div>
    </div>
  </div>
</section>
</div>
<?php include( 'include/dashboard-footer.php'); ?>
<script>
  $(':radio').change(function() {
    console.log('New star rating: ' + this.value);
  });
</script>
<script>
  $(document).ready(function() {
        var buttonAdd = $("#add-button2");
        var buttonRemove = $("#remove-button2");
        var className = ".dynamic-input2";
        var count = 0;
        var field = "";
        var maxFields =50;
      
        function totalFields() {
          return $(className).length;
        }
      
        function addNewField() {
          count = totalFields() + 1;
          field = $("#dynamic-input-2").clone();
          field.attr("id", "dynamic-input-" + count);
          field.children("label").text("Field " + count);
          field.find("input").val("");
          $(className + ":last").after($(field));
        }
      
        function removeLastField() {
          if (totalFields() > 1) {
            $(className + ":last").remove();
          }
        }
      
        function enableButtonRemove() {
          if (totalFields() === 2) {
            buttonRemove.removeAttr("disabled");
            buttonRemove.addClass("shadow-sm");
          }
        }
      
        function disableButtonRemove() {
          if (totalFields() === 1) {
            buttonRemove.attr("disabled", "disabled");
            buttonRemove.removeClass("shadow-sm");
          }
        }
      
        function disableButtonAdd() {
          if (totalFields() === maxFields) {
            buttonAdd.attr("disabled", "disabled");
            buttonAdd.removeClass("shadow-sm");
          }
        }
      
        function enableButtonAdd() {
          if (totalFields() === (maxFields - 1)) {
            buttonAdd.removeAttr("disabled");
            buttonAdd.addClass("shadow-sm");
          }
        }
      
        buttonAdd.click(function() {
          addNewField();
          enableButtonRemove();
          disableButtonAdd();
        });
      
        buttonRemove.click(function() {
          removeLastField();
          disableButtonRemove();
          enableButtonAdd();
        });
      });
</script>