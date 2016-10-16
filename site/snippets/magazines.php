<div class="magazine-list">
  <?php foreach($page->children() as $project): ?>

    <div class="gallery-list">
      <div class="gallery-list-intro">
        <b><?php echo $project->title()->html(); ?></b>
        <?php echo $project->text()->kirbytext(); ?>
      </div>
      <ul class='gallery-list-images'>
       <?php foreach($project->pictures()->yaml() as $image): ?>
         <?php $img = $project->image($image); ?>
        <li class='gallery-list__image' data-src="<?php echo ($img->gallerylink() == '' ? $img->url() : $img->gallerylink()) ?>">
          <img src="<?php echo $img ? $img->url() : '' ?>" alt="<?php echo $project->title()->html() ?>" />
        </li>
       <?php endforeach ?>
      </ul>
    </div>
  <?php endforeach ?>
</div>
