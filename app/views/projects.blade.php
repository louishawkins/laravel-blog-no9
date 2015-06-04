@extends('layouts.master')
@section('content')
<!-- Page Header -->
<header class="intro-header" style="background-image: URL('{{ $backgroundImage }}')">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                <div class="page-heading">
                    <h1>Projects</h1>
                    <hr class="small">
                    <span class="subheading">This is what I do.</span>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- Main Content -->
<div class="container">
    <div class="row">
        <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
            @foreach ($projects as $project)
                <div class="col-md-8 project-card">
                    <div class="col-md-2 project-thumbnail">
                        <img src="{{ $project->thumbnail }}" />
                    </div>
                    <div class="col-md-6 project-info">
                        <h3><a href="{{ $project->path }}">{{ $project->project_name }}</a></h3>
                        <p>{{ $project->description }}</p>
                        <span><a href="{{ $project->github }}">View on Github</a></span>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
</div>

<hr>
@stop