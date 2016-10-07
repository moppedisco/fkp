<?php snippet('header') ?>

<main  id="barba-wrapper" class="main" role="main">
  <div class="barba-container" data-namespace="leftcol">
    <div class="content">
      <h1><?php echo $page->title()->html() ?></h1>
      <?php snippet('projects') ?>
    </div>
    <button class="close-button">✕</button>
  </div>
</main>

<?php snippet('footer') ?>
