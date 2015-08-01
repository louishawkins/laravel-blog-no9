<?php
    function getClientIpAddress(){
        return 'testing';
    }

    $integrations = [
        "crms" => '<option>Close.io</option><option>Salesforce</option><option>SugarCRM</option><option>Zoho</option>'
    ]

?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Louis Hawkins</title>
    <script src="/js/angular/angular.min.js"></script>
    <script src="/js/angular/signup.js"></script>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/font-awesome.min.css">
    <link rel="stylesheet" href="/css/signup-new.css">
    <link href='http://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'>
</head>

<body ng-controller="SignupController">

    <div id="wrapper">
        <div id="width_wrapper">
            <a href="http://www.callinize.com/" id="callinize-logo">
                <img src="https://cdn.callinize.com/wp-content/themes/callinize/images/logo.png">
            </a>
            <div class="blue accent"></div>
            <form id="registration" method="post" action="https://dashboard.callinize.com/signup?origin=signup" name="form">
                <div id="middle">
                    <p></p>
                    <div class="form_part p1">
                        <div id="top" class="sign-up-header">
                            Sign up
                            <div class="subheading">Completely free. No credit card required.</div>
                        </div> <!-- div id top sign up header -->
                        <p>
                            <label for="name">First and last name:</label>
                            <br>
                            <input class="reqblue" id="name" maxlength="30" name="name" ng-model="name" type="text" required autofocus>
                        </p>

                        <p>
                            <label for="username">Email:</label>
                            <br>
                            <input class="reqblue" id="username" name="username" ng-model="username" type="email" unique-username required>
                        </p>

                        <p>
                            <label for="password">Password:</label>
                            <br>
                            <input class="reqblue" id="password" name="password" ng-model="password" type="password" required>
                        </p>
                    </div> <!-- form part p1 -->

                    <div class="form_part p2">
                        <div id="top" class="sign-up-header">
                            Awesome!
                            <div class="subheading">Tell us about yourself.</div>
                        </div> <!-- div id top sign up header -->
                       <p>
                            <label for="company">Company:</label>
                            <br>
                            <input class="reqblue" id="company" maxlength="30" name="company" ng-model="company" type="text" unique-company required>
                        </p>

                        <p>
                            <label for="phoneNumber">Phone number:</label>
                            <br>
                            <input class="reqblue" id="phoneNumber" name="phoneNumber" ng-model="phoneNumber" type="text">
                        </p>

                        <p>
                            <label for="crmProvider">Which CRM do you use?</label>
                            <br>
                            <select name="crmProvider" id="crmProvider" required>
                                <?php echo $integrations['crms'] ?>
                            </select>
                        </p>

                        <p></p>
                        <p class="terms">
                             By signing up for Callinize you agree to our <a href="#terms">terms of service</a> and <a href="#privacy">privacy policy</a>.
                        </p>
                    </div>
                    <div id="separator"></div>
                    <div id="good_company">
                        You are in good company.
                        <img src="//cdn.mxpnl.com/cache/d7b6b0924cc9f88fe0fe9a8378532b7f/images/user/logos-all6.png">
                    </div>
                    <div class="clear"></div>

                </div> <!-- div id middle -->
                <div id="bottom">
                    <input type="hidden" name="ip" value="<?= getClientIpAddress() ?>" />
                    <input type="hidden" id="sio" name="sio" >
                    <input type="button" id="continue_button" value="Continue" class="p1" style="display: inline-block;" ng-click="page1=false;page2=true;">
                    <a href="#1" id="back" class="p2" style="display: inline;">← Back</a>
                    <input type="submit" value="GET STARTED" class="login-submit p2" style="display: none;">
                </div>
            </form>
            <div id="bottom_link">
                Already have an account?
                <a href="#login">Log in</a></div>
            </div>
    </div> <!--wrapper-->

</body>
</html>