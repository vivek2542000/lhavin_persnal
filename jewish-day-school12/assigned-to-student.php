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
              <div class="head-title">
              <h2 class="form-title">Assigned to Student</h2>
              <button class="main-btn" data-toggle="modal" data-target="#assign-pdf">Assign a new Task</button>
             </div>
             
              <!--  <div class="form-define-head">
                <h4><span>step 3</span>Other Links</h4>
              </div> -->
              <div class="row">
     <div class="col-md-12">
                 <div class="table-responsive">
  <table id="example" class="table table-striped table-bordered" style="width:100%">
    <thead><tr>
      <th>Assign Date</th>
      <th>PDF Name</th>
      <th>Description</th>
      <th>Last Edited</th>
      <th>Assigned To</th>
      <th>Status</th>
      <th>Action</th> 
    </tr></thead>
    <tbody>
      <tr>
        <td>01/07/2020</td>
        <td><a href="teach.pdf" target="_blank"><i class="fa fa-file-pdf-o mr-5"></i>PDF1</a></td>
        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.</td>
        <td>03/07/2020</td>
        <td>Mohan</td>
        <td align="center"><span class="badge badge-success">Completed</span></td>
        <td align="center"><table>
          <tr>
            <td ><a href="" class="edit-btn"  data-toggle="modal" data-target="#edit-popup">Edit</a></td>
            <td><a href="view-assigned-logs-to-student.php" class="view-btn" title="View Logs">View Logs</a></td>
            
          </tr>
        </table></td>
      </tr>
       <tr>
        <td>07/07/2020</td>
        <td><a href="teach.pdf" target="_blank"><i class="fa fa-file-pdf-o mr-5"></i>PDF2</a></td>
        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.</td>
        <td>11/07/2020</td>
        <td>Rahul</td>
        <td align="center"><span class="badge badge-danger">Inprogress</span></td>
        <td align="center"><table>
          <tr>
            <td ><a href="" class="edit-btn"  data-toggle="modal" data-target="#edit-popup">Edit</a></td>
            <td><a href="view-assigned-logs-student.php" class="view-btn" title="View Logs">View Logs</a></td>
           
          </tr>
        </table></td>
      </tr>
       <tr>
        <td>12/08/2020</td>
        <td><a href="teach.pdf" target="_blank"><i class="fa fa-file-pdf-o mr-5"></i>PDF3</a></td>
        
        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.</td>
        <td>14/08/2020</td>
        <td>Nitesh</td>
        <td align="center"><span class="badge badge-success">Completed</span></td>
        <td align="center"><table>
          <tr>
            <td ><a href="" class="edit-btn"  data-toggle="modal" data-target="#edit-popup">Edit</a></td>
            <td><a href="view-assigned-logs-student.php" class="view-btn" title="View Logs">View Logs</a></td>
           
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
