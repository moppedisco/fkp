<?php snippet('header') ?>

<main  id="barba-wrapper" class="main" role="main">
  <div class="barba-container" data-namespace="rightcol">
    <div class="content">
      <h1><?php echo $page->title()->html() ?></h1>
      <?php snippet('projects') ?>
    </div>
  </div>
</main>

<?php snippet('footer') ?>
