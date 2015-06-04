@extends('layouts.master')
@section('content')
<!-- Page Header -->
    <!-- Set your background image for this header on the line below. -->
    <header class="intro-header" style="background-image: url('{{ $backgroundImage }}')">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                    <div class="site-heading">
                        <h1>Clean Blog</h1>
                        <hr class="small">
                        <span class="subheading">A Clean Blog Theme by Start Bootstrap</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
            	<!-- blog posts -->
            	@foreach ($posts as $post)
                <div class="post-preview">
                    <a href={{ URL::route('posts.show', $post->id) }}>
                        <h2 class="post-title">
                            {{ $post->title }}
                        </h2>
                        <h3 class="post-subtitle">
                            {{ $post->subtitle }}
                        </h3>
                    </a>
                    <p class="post-meta">Posted by <a href="#">{{ $post->user->userInfo->first_name }} {{ $post->user->userInfo->last_name }}</a> on {{ $post->created_at }}</p>
                </div>
                <hr>
                @endforeach
                <!-- end blog post -->
               
                <!-- Pager -->
                <ul class="pager">
                    <li class="next">
                        {{ $posts->links() }}Older Posts &rarr;
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <hr>

@stop