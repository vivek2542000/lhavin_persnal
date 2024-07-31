<!DOCTYPE html>
<html>
<head>
  <title>Student|Dashboard</title>
  <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" href="images/favicon.png" type="image/x-icon">
   <!--  <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"> -->
    <link rel="stylesheet" href="css/bootstrap.min.css">
     <link rel="stylesheet" type="text/css" href="css/dataTables.bootstrap4.min.css">

    <link rel="stylesheet" type="text/css" href="css/dashboard.css">
    <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
     <link rel="stylesheet" href="css/bootstrap-multiselect.css">
     <link href="css/select2.min.css" rel="stylesheet" />
     <link href="css/montserrat.css" rel="stylesheet">
     <link href="css/intlTelInput.css" rel="stylesheet" media="screen">
</head>

<div id="wrapper">

  <aside id="sidebar-wrapper" class="shadow1">
    <div class="sidebar-brand">
      <div class="avatar-upload">
                              <div class="avatar-edit">
                                <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg">
                                <label for="imageUpload"></label>
                              </div>
                              <div class="avatar-preview">
                                <div id="imagePreview" style="background-image: url(images/avatar-10.jpg);"></div>
                              </div>
                            </div>
      <h6 class="mt-10">Mohan Sharma</h6>
    </div>
    <ul class="sidebar-nav">
      <li class="active">
        <a href="student-dashboard.php"><i class="fa fa-dashboard"></i>Dashboard</a>
      </li>
      <li>
    <a href="student-edit-profile.php"><i class="fa fa-user"></i> Edit Profile</a>
  </li>
    <li>
    <a href="student-change-password.php"><i class="fa fa-key"></i>Change Password</a>
      </li>
      <li>
        
    <a href="student-assigned-pdf.php"><i class="fa fa-file-pdf-o"></i>Assigned PDF</a></li>
    <li><a href="student-complete-pdf.php"><i class="fa fa-file-pdf-o"></i>Completed PDF</a>
      </li>
     
    </ul>
  </aside>

  <div id="navbar-wrapper">
    <nav class="navbar navbar-inverse">
      <div class="container-fluid">
        <div class="header-cont d-flex justify-content-between">
        <div class="navbar-header">
          <a href="#" class="navbar-brand" id="sidebar-toggle"><i class="fa fa-bars"></i>
           <img src="images/icons/logo.png" class="mobile-logo"></a>
          <!-- <a href="dashboard.php  ">
     </a> -->
        </div>
        <div class="head-right">
          <ul>
            <li>
          <div class="dropdown">
    <button type="button" class="btn btn-notification dropdown-toggle notification" data-toggle="dropdown"><i class="fa fa-bell"></i>
    </button>
    <div class="dropdown-menu">
       <ul  id="web-notification" class="notification-lsit">
                                     <li id="nid_829"> 
                  <a href="#">
                  
                                       <img src="images/student.png" class="notification-user">
                                          <div class="mobiledatabox">
                     <div class="mobbox web-box">
                     
                     <h2>Jitendra</h2>
                        <h4>Just Now</h4>
                                </div>
                                
                     <div class="mobbox">
                   
                    <span style=" color: #3CAE24;"> A pdf assigned to you</span>
                    </div>
                    </div>
                    </a>
                    </li>
                                      <li id="nid_828"> 
                  <a href="#">
                  
                                       <img src="images/student.png" class="notification-user">
                                          <div class="mobiledatabox">
                     <div class="mobbox web-box">
                     
                     <h2>Jitendra</h2>
                        <h4>Just Now</h4>
                                </div>
                                
                     <div class="mobbox">
                   
                    <span style=" color: #3CAE24;">You have mark a PDF as completed</span>
                    </div>
                    </div>
                    </a>
                    </li>
                                      <li id="nid_827"> 
                  <a href="#">
                  
                                       <img src="images/student.png" class="notification-user">
                                          <div class="mobiledatabox">
                     <div class="mobbox web-box">
                     
                     <h2>Rajendra</h2>
                        <h4>Just Now</h4>
                                </div>
                                
                     <div class="mobbox">
                   
                    <span style=" color: #3CAE24;">You have mark a PDF as completed</span>
                    </div>
                    </div>
                    </a>
                    </li>
                                      <li id="nid_826" > 
                  <a href="#">
                  
                                       <img src="images/student.png" class="notification-user">
                                          <div class="mobiledatabox">
                     <div class="mobbox web-box">
                     
                     <h2>Praveen</h2>
                        <h4>Just Now</h4>
                                </div>
                                
                     <div class="mobbox">
                   
                    <span style=" color: #3CAE24;">A pdf assigned to you</span>
                    </div>
                    </div>
                    </a>
                    </li>
                  </ul>
    </div>
    <span class="badge">3</span>
  </div>

</li>
<li><a href="index.php"><i class="fa fa-power-off"></i></a></li>
</ul>
</div>
      </div>
    </div>
    </nav>
  </div>
