<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Louis Hawkins</title>
	<link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css">
	<link rel="stylesheet" href="/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="/css/master.css">
</head>
<body>

	@include('partials.nav')
	@yield('content')
	@include('partials.footer')

	<script src="/js/jquery.min.js"></script>
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/clean-blog.js"></script>

</body>
</html>
