<?php

class UsersTableSeeder extends Seeder {

	public function run()
	{
		$user = new User();
		$user->email = "louishawkins@gmail.com";
		$user->password = Hash::make('ttwlh11189');
		$user->role_id = 1;
		$user->save();
	}

}