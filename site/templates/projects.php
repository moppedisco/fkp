<?php snippet('header') ?>

<main  id="barba-wrapper" class="main" role="main">
  <div class="barba-container" data-namespace="leftcol">
    <div class="content">
      <h1><?php echo $page->title()->html() ?></h1>
      <p> <?php echo $page->text()->html() ?></p>
      <?php snippet('projects') ?>
    </div>
  </div>
</main>

<?php snippet('footer') ?>
