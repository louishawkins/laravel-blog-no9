<?php

class Project extends \Eloquent {
	protected $fillable = ['user_id', 'project_name', 'description', 'github', 'path'];

	public function user()
	{
		$this->belongsTo('User');
	}
}