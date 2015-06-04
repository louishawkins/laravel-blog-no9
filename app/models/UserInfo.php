<?php

class UserInfo extends \Eloquent {
	protected $fillable = ['user_id', 'first_name', 'last_name', 'description', 'profile_image_url', 'header_image_url', 'phone_number', 'twitter', 'github', 'linkedin'];

	public function user()
	{
		return $this->belongsTo('User');
	}

}