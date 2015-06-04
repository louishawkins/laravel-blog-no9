<?php

class Post extends BaseModel {

	// Add your validation rules here
	public static $rules = [
		// 'title' => 'required'
	];

	// Don't forget to fill this array
	protected $fillable = [
		'title',
		'post_image_url',
		'body',
		'user_id'
	];

	public function user()
	{
		return $this->belongsTo('User');
	}

	public function getSubtitleAttribute()
	{
		$subtitle = substr($this->body, 0, 149);
		return $subtitle;
	}

}