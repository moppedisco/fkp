<?php snippet('header') ?>

<main  id="barba-wrapper" class="main" role="main">
  <div class="barba-container">
    <h1><?php echo $page->title()->html() ?></h1>
    <?php echo $page->text()->kirbytext() ?>
  </div>
</main>

<?php snippet('footer') ?>
