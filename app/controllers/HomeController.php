<?php

class HomeController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| Default Home Controller
	|--------------------------------------------------------------------------
	|
	| You may wish to use controllers instead of, or in addition to, Closure
	| based routes. That's great! Here is an example controller method to
	| get you started. To route to this controller, just add the route:
	|
	|	Route::get('/', 'HomeController@showWelcome');
	|
	*/

	public function showIndex()
	{
		$randomNumber = mt_rand(1,2);
		$backgroundImage = "/images/home-bg" . $randomNumber . ".jpg";

		$query = Post::with('User');
		$posts = $query->orderBy('created_at', 'desc')->paginate(5);
		return View::make('index')->with(array('backgroundImage' => $backgroundImage, 'posts' => $posts));
	}

    public function showPricing()
    {
        return View::make('pricing');
    }

    public function showSignupPage()
    {
        return View::make('signup');
    }

    public function showNewSignupPage()
    {
        return View::make('signup-new');
    }

	public function showAbout()
	{
		$user = User::where("email", "=", "louishawkins@gmail.com")->firstOrFail();
		$backgroundImage = "/images/home-bg1.jpg";
		return View::make('about')->with(array('user' => $user, 'backgroundImage' => $backgroundImage));
	}

	public function showContactInfo()
	{
		$user = User::where("email", "=", "louishawkins@gmail.com")->firstOrFail();
		return View::make('contact')->with(array('user' => $user));
	}

}
