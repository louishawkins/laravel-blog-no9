<?php 

use Carbon\Carbon;

class BaseModel extends Eloquent 
{
	public function getCreatedAtAttribute($value)
	{
		$utc = Carbon::createFromFormat($this->getDateFormat(), $value);
		$utc->setTimezone('America/Chicago');
		return $utc->format('l F jS Y h:i:s A');
	}

	public function getUpdatedAtAttribute($value)
	{
		$utc = Carbon::createFromFormat($this->getDateFormat(), $value);
		return $utc->setTimezone('America/Chicago');
	}
}