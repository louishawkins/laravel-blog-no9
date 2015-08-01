<?php

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
            <form id="registration" method="post" action=".">
                <div id="middle">
                    <p></p>
                    <div class="form_part p1">
                        <div id="top" class="sign-up-header">
                            Sign up
                            <div class="subheading">Completely free. No credit card required.</div>
                        </div> <!-- div id top sign up header -->
                        <p>
                            <label for="id_name">First and last name:</label>
                            <br>
                            <input class="reqblue" id="id_name" maxlength="30" name="name" type="text">
                        </p>

                        <p>
                            <label for="id_email">Email:</label>
                            <br>
                            <input class="reqblue" id="id_email" name="email" type="email">
                        </p>

                        <p>
                            <label for="id_password1">Password:</label>
                            <br>
                            <input class="reqblue" id="id_password1" name="password1" type="password">
                        </p>
                    </div> <!-- form part p1 -->

                    <div class="form_part p2" style="display: none;">
                        <div id="top" class="sign-up-header">
                            Sign up
                            <div class="subheading">Completely free. No credit card required.</div>
                        </div> <!-- div id top sign up header -->
                       <p>
                            <label for="id_company">Company:</label>
                            <br>
                            <input class="reqblue" id="id_company" maxlength="30" name="company" type="text">
                        </p>

                        <p>
                            <label for="id_email">Phone number:</label>
                            <br>
                            <input class="reqblue" id="id_phone" name="phone" type="text">
                        </p>

                        <p>
                            <label for="number_of_employees_hidden_field">How many employees do you have?</label>
                            <br>
                            <!-- assuming still put input -->
                            <input class="reqblue" id="number_of_employees_hidden_field" name="password1" type="hidden">
                        </p>

                        <div id="number_of_employees_dropdown">Dropdown</div>

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
                    <input id="id_invited" name="invited" type="hidden">
                    <input id="id_from_param" name="from_param" type="hidden">
                    <input id="id_promo_slug" name="promo_slug" type="hidden">
                    <input id="number_of_employees_hidden_field" name="number_of_employees" type="hidden" value="2">
                    <input type="button" id="continue_button" value="Continue" class="p1" style="display: none;">
                    <a href="#1" id="back" class="p2" style="display: inline;">← Back</a>
                    <input type="submit" value="Sign up" class="p2" style="display: inline-block;">
                </div>
            </form>
            <div id="bottom_link">
                Already have an account?
                <a href="#login">Log in</a></div>
            </div>
    </div> <!--wrapper-->

</body>
</html>