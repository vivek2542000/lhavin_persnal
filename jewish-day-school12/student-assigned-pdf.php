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
              <h2 class="form-title">Assigned PDF</h2>
             
             
              <!--  <div class="form-define-head">
                <h4><span>step 3</span>Other Links</h4>
              </div> -->
              <div class="row">
     <div class="col-md-12">
                 <div class="table-responsive">
  <table id="example" class="table table-striped table-bordered" style="width:100%">
    <thead><tr>
      <th>Assigned Date</th>
      <th>PDF Name</th>
      <th>Assigned By</th>
      <th>Description</th>
      <th>Last Edit</th>
      <th>Status</th>
      <th>Action</th>
    </tr></thead>
    <tbody>
      <tr>
        <td>01/07/2020</td>
        <td><a href=""><i class="fa fa-file-pdf-o mr-5"></i>PDF1</a></td>
        <td>Rahul Sir</td>
        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.</td>
        <td>06/07/2020</td>
        <td align="center"><span class="badge badge-success">Completed</span></td>
         <td align="center">
          <table><tr><td ><a href="" class="edit-btn"  data-toggle="modal" data-target="#edit-popup">Edit</a></td>
           <td><a href="student-view-assigned-logs.php" class="view-btn" title="View Logs">View Logs</a></td></tr>
        
        </table>
      </td>

        <!-- <td align="center" style="white-space: nowrap;"><a href="" class="assign-btn">Shift in Complete</a></td> -->
      </tr>
        <tr>
        <td>05/07/2020</td>
        <td><a href=""><i class="fa fa-file-pdf-o mr-5"></i>PDF2</a></td>
        <td>Mohit Sir</td>
        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.</td>
        <td>09/07/2020</td>
        <td align="center"><span class="badge badge-danger">Inprogress</span></td>
        <td align="center">
          <table><tr><td ><a href="" class="edit-btn"  data-toggle="modal" data-target="#edit-popup">Edit</a></td>
           <td><a href="student-view-assigned-logs.php" class="view-btn" title="View Logs">View Logs</a></td></tr>
        
        </table>
      </td>

        <!-- <td align="center" style="white-space: nowrap;"><a href="" class="assign-btn">Shift in Complete</a></td> -->
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
