<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', 'HomeController@showIndex');
Route::get('/about', 'HomeController@showAbout');
Route::get('/contact', 'HomeController@showContactInfo');
Route::get('/project', 'ProjectsController@index');
Route::get('/pricing', 'HomeController@showPricing');

Route::resource('posts', 'PostsController');
