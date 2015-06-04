<?php

// Composer: "fzaninotto/faker": "v1.3.0"
use Faker\Factory as Faker;

class ProjectsTableSeeder extends Seeder {

	public function run()
	{
		$project = new Project();
		$project->user_id = User::first()->id;
		$project->project_name = "Whack-a-Goat";
		$project->description = "Whack-a-Mole game written in JavaScript.";
		$project->github = "http://github.com/louishawkins/whack-a-goat";
		$project->path = "/projects/whackagoat/index.html";
		$project->thumbnail = "/images/projects/goat.jpg";
		$project->save();

		$project = new Project();
		$project->user_id = User::first()->id;
		$project->project_name = "Address Book";
		$project->description = "Address Book application written in PHP.";
		$project->github = "http://github.com/louishawkins/addressbook";
		$project->path = "http://github.com/louishawkins/addressbook";
		$project->thumbnail = "/images/projects/addressbook.jpg";
		$project->save();
	}

}