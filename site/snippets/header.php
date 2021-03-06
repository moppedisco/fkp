<!DOCTYPE html>
<html lang="en">
<head>
  <style media="screen">
    .template--home .fullscreen-bg video {opacity: 0; transform: scale(1.1);}
  </style>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0">

  <title><?php echo $site->title()->html() ?> | <?php echo $page->title()->html() ?></title>
  <meta name="description" content="<?php echo $site->description()->html() ?>">
  <meta name="keywords" content="<?php echo $site->keywords()->html() ?>">
  <?php echo css('assets/css/normalize.css') ?>
  <?php echo css('assets/css/main.css') ?>
</head>
<body class='template--<?php echo $page->template() ?>'>

<header class="header" role="banner">
  <?php snippet('menu') ?>
</header>
