<?php

?>
<!doctype html>
<html lang="en" ng-app="signupApp">
<head>
    <meta charset="UTF-8">
    <title>Louis Hawkins</title>
    <script src="/js/angular/angular.min.js"></script>
    <script src="/js/angular/signup.js"></script>
    <script src="/js/jquery.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="/css/signup.css">
    <link href='http://fonts.googleapis.com/css?family=Lato' rel='stylesheet' type='text/css'>
</head>

<body ng-controller="SignupController">

<section class="order">
    <header class="header">
        <div class="header-holder">
            <section class="promo-block">
                <strong class="title">Try Callinize <strong>FREE</strong> for 15 days</strong>
                <header class="heading">
                    <p>1 plan, all the features. Risk free, no credit card required.</p>
                </header>
            </section>
        </div>
    </header>

    <div class="order-section">
        <div class="footer-widgets widget_text product-promotion" id="text-6">
            <strong class="title"><span>
            <span class="currency">$</span>19<sup>*</sup></span>/user/month</strong>
            <nav>
                <strong class="title">Includes Everything</strong>
                <ul>
                    <li>Automatic Call Logging</li>
                    <li>Click To Dial</li>
                    <li>Call Popups</li>
                    <li>Actionable Analytics</li>
                    <li>Create Tasks</li>
                    <li>@mention Syntax</li>
                    <li>Customer Support</li>
                </ul>
            </nav>
            <P>
                <small>* 5 user (or $95 month) minimum, some phone systems require an additional setup fee. Examples: Avaya, Cisco, Shoretel, NEC, and Panasonic.</small>
            </P>
        </div>
        <div class="order-form">
            <form action="https://dashboard.callinize.com/signup?origin=signup" method="post" class="wpcf7-form" name="form">
                <input type="hidden" name="ip" value="192.168.0.1" />
                <label for="name">Name</label>
                 <span>
                <input type="text" name="name" id="name" ng-model="name" placeholder="Full Name"
                       required autofocus>
                <span ng-show="form.name.$dirty && form.name.$error.required" class="help-block"
                      style="display: none;">Please enter your name</span>
                </span>
                <label for="company">Company</label>
                <span>
                <input type="text" name="company" id="company" ng-model="company"
                       placeholder="Company" unique-company required>
                <span ng-show="form.company.$dirty && form.company.$error.required"
                      class="help-block"
                      style="display: none;">Please enter your company
                </span>
                <span id="company-taken" ng-show="form.company.$error.isTaken"
                      class="help-block">
                      Company already signed up. If you are an admin, reset your password,
                      if you are a user ask your admin to send you an invite.
                      <br>
                      <a href="https://dashboard.callinize.com/login">Login to Account</a><br>
                      <a href="https://dashboard.callinize.com/resetPassword">Reset Password</a>
                </span>
                 </span>
                <label for="username">Email Address</label>
                <span>
                    <input type="email" name="username" id="username" ng-model="username"
                           placeholder="example@callinize.com"
                           unique-username required>
                    <i ng-show="busy" class="halflings-icon refresh rotating"
                       style="display: none;"></i>
                    <span ng-show="form.username.$dirty && form.username.$error.required"
                          class="help-block"
                          style="display: none;">Please enter your email address</span>
                    <span id="username-taken"
                          ng-show="form.username.$dirty && form.username.$error.isTaken"
                          class="help-block">Email already signed up<br>
                          <a href="https://dashboard.callinize.com/login">Login to Account</a><br>
                          <a href="https://dashboard.callinize.com/resetPassword">Reset Password</a>
                    </span>
                    <span ng-show="form.username.$dirty && form.username.$error.email"
                          class="help-block"
                          style="display: none;">Email is invalid</span>
                </span>
                <label for="phoneNumber">Phone Number</label>
                <span>
                    <input type="text" name="phoneNumber" id="phoneNumber" ng-model="phoneNumber" placeholder="###-###-####">
                    <span ng-show="form.phoneNumber.$dirty && form.phoneNumber.$error.required"
                          class="help-block"
                          style="display: none;">Please enter your phone number</span>
                </span>

                <label for="password">Password</label>
                <span>
                <input type="password" name="password" id="password" ng-model="password" required>
                <span ng-show="form.password.$dirty && form.password.$error.required"
                      class="help-block"
                      style="display: none;">Please enter your password</span>
                </span>
                <label ng-hide="phoneSet" for="phoneSystem">Phone system</label>
                <span ng-hide="phoneSet">
                <select name="phoneSystem" id="phoneSystem" required>
                </select>
                 <span ng-show="form.phoneSystem.$dirty && form.phoneSystem.$error.required"
                       class="help-block"
                       style="display: none;">Please select your Phone System</span>
                </span>
                <label ng-hide="crmSet" for="crmProvider">Your CRM</label>
                <span ng-hide="crmSet">
                    <select name="crmProvider" id="crmProvider" required>
                    </select>
                 <span ng-show="form.crmProvider.$dirty && form.crmProvider.$error.required"
                       class="help-block"
                       style="display: none;">Please select your CRM provider</span>

                </span>
                <input type="hidden" name="sio" id="sio">
                <input type="submit" value="GET STARTED" class="login-submit">
            </form>
        </div>

        <div>
            <strong class="title product-promotion">Have a question? Send it to <a
                    href="mailto:hello@callinize.com">hello@callinize.com</a></strong>
        </div>
    </div>
</section>
