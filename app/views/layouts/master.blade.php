<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Louis Hawkins</title>
	<link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="/css/master.css">
</head>
<body>
	@include('partials.nav')
	<div class="container-fluid">
		@yield('content')
	</div>

	<script src="/js/jquery.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
</body>
</html>
