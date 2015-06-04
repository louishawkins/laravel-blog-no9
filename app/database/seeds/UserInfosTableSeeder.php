<?php

class UserInfosTableSeeder extends Seeder {

	public function run()
	{
		$content = new UserInfo();
		$content->user_id = User::first()->id;
		$content->first_name = "Louis";
		$content->last_name = "Hawkins";
		$content->description = "Description here.";
		$content->profile_image_url = "/images/louis.jpg";
		$content->header_image_url = "/images/louis-header.jpg";
		$content->phone_number = "(830) 931-1398";
		$content->twitter = "http://twitter.com/louishawkins";
		$content->github = "http://github.com/louishawkins";
		$content->linkedin = "http://linkedin.com/in/louishawkins";
		$content->save();
	}

}