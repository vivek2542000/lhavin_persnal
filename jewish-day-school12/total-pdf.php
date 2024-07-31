<?php include( 'include/teacher-dashboard-header.php'); ?>
<!----------------COntent start-------------->
<section id="content-wrapper">
  <div class="container-fluid">
    <div class="row p-t-b-20">
      <div class="col-md-12">
        <div class="form-card no-b">
          <div class="login-form-card">
            <!-- <div class="login-form-content"> -->
            <form action="javascript:(0);">
              <h2 class="form-title">Total PDF</h2>
             
             
              <!--  <div class="form-define-head">
                <h4><span>step 3</span>Other Links</h4>
              </div> -->
              <div class="row">
     <div class="col-md-12">
                 <div class="table-responsive">
  <table id="example" class="table table-striped table-bordered" style="width:100%">
    <thead><tr>
      <th>S.No.</th>
      <th>PDF Name</th>
      <th>Description</th>
      <th>Action</th> 
    </tr></thead>
    <tbody>
      <tr>
        <td>01</td>
        <td>PDF1</td>
        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.</td>
        <td align="center"><table>
          <tr>
            <td ><a href="" class="edit-btn">Edit</a></td>
            <td><a href="" class="assign-btn" data-toggle="modal" data-target="#assign-pdf">Assign</a></td>
          </tr>
        </table></td>
      </tr>

    </tbody>
  </table>
</div>
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