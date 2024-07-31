<?php include( 'include/teacher-dashboard-header.php'); ?>
<!----------------Page Content Start------------>
<section id="content-wrapper" style="background-color: #fff!important;">
  <div class="container-fluid">
    <div class="row pb-40">
      <div class="col-md-6 wd-50">
        <p class="dash-head" style="margin: 0;">Welcome : <span style="display: inline-block; margin-bottom: 0;">Username </span>
        </p>
      </div>
      <div class="col-md-6 wd-50">
        <p class="dash-head" style="text-align: right;margin-bottom: 0;">Last Login : <span style="display: inline-block; "> 12:00 PM </span>
        </p>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 wd-25">
        <a href="my-hotel.php">
        <div class="counter-card ">
          <div class="count-icon text-center bg-red"> <i class="fa fa-users fa-2x"></i>
          </div>
          <div class="count-text">
            <h2 class="timer count-title count-number" data-to="300" data-speed="1500"></h2>
            <p class="">Total  Students</p>
          </div>
        </div>
      </a>
      </div>
      <div class="col-md-6 wd-25">
        <a href="my-event.php">
        <div class="counter-card ">
          <div class="count-icon text-center bg-brown"> <i class="fa fa-file-pdf-o fa-2x"></i>
          </div>
          <div class="count-text">
            <h2 class="timer count-title count-number" data-to="410" data-speed="1500"></h2>
            <p class="">Total PDF</p>
          </div>
        </div>
      </a>
      </div>
    </div>
    <hr>
    <section class="">
      <div class="tour-head">
                    <div class="tour-head-title">
                        <h5>Recent Assigned PDF</h5>
                    </div>
                </div>
    <div class="row mt-20">
<div class="table-responsive">
  <table id="example" class="table table-striped table-bordered" style="width:100%">
    <thead><tr>
      <th>Assign Date</th>
      <th>PDF Name</th>
      <th>Assigned By</th>
      <th>Description</th>
      <th>Last Edited</th>
      <th>Action</th> 
    </tr></thead>
    <tbody>
      <tr>
        <td>01/07/2020</td>
        <td><a href=""><i class="fa fa-file-pdf-o mr-5"></i>PDF1</a></td>
        <td>Admin</td>
        <td>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.</td>
        <td>03/07/2020</td>
        <td align="center"><table>
          <tr>
             <td ><a href="" class="edit-btn"  data-toggle="modal" data-target="#edit-popup">Edit</a></td>
            <td><a href="view-assigned-pdf-logs.php" class="view-btn" title="View Logs">View Logs</a></td>
            
          </tr>
        </table></td>
      </tr>
    </tbody>
  </table>
</div>
    </div>
  </section>
  </div>
</section>
<?php include( 'include/dashboard-footer.php'); ?>