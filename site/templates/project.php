<?php snippet('header') ?>

<main id="barba-wrapper" class="main" role="main">
  <div class="barba-container" data-namespace="project">
    <div class="content">
      <h1><?php echo $page->title()->html() ?></h1>
      <p> <?php echo $page->text()->kirbytext() ?></p>
      <ul class='mosaic-layout'>
        <?php foreach($page->screenshots()->toStructure() as $screenshot): ?>
          <?php $img = $screenshot->images()->find($screenshot->image()); ?>
          <li class='<?php echo $screenshot->size()->html() ?> <?php echo $screenshot->pushLeft()->html() ?> vert-<?php echo $screenshot->vertical()->html() ?>'>
            <?php $isVideo = $page->image($screenshot->image())->gallerylink(); ?>
            <?php if($isVideo == ''): ?>
              <img src="<?php echo $img->url(); ?>/<?php echo $screenshot->image(); ?>" alt="<?php echo $screenshot->description()->html() ?>">
            <?php else: ?>
              <?php echo vimeo($isVideo) ?>
            <?php endif ?>
            <p><?php echo $screenshot->description()->html() ?></p>
          </li>
        <?php endforeach ?>
      </ul>
    </div>
  </div>
</main>

<?php snippet('footer') ?>
