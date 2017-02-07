<?php snippet('header') ?>

<main id="barba-wrapper" class="main" role="main">
  <div class="barba-container" data-namespace="project">
    <div class="content">
      <h1><?php echo $page->title()->html() ?></h1>
      <p> <?php echo $page->text()->html() ?></p>
      <ul class='mosaic-layout'>
        <?php foreach($page->screenshots()->toStructure() as $screenshot): ?>
          <?php $img = $screenshot->images()->find($screenshot->image()); ?>
          <li class='<?php echo $screenshot->size()->html() ?> <?php echo $screenshot->pushLeft()->html() ?> vert-<?php echo $screenshot->vertical()->html() ?>'>
              <img src="<?php echo $img->url(); ?>/<?php echo $screenshot->image(); ?>" alt="<?php echo $screenshot->description()->html() ?>">
              <p><?php echo $screenshot->description()->html() ?></p>
          </li>
        <?php endforeach ?>
      </ul>
    </div>
  </div>
</main>

<?php snippet('footer') ?>
