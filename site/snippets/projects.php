<div class="project-list">
  <?php echo $page->text()->kirbytext() ?>
  <?php foreach($page->children() as $project): ?>

    <div class="gallery-list">
      <ul class='gallery-list-images'>
       <?php foreach($project->pictures()->yaml() as $image): ?>
         <?php $img = $project->image($image); ?>
        <li class='gallery-list__image' data-src="<?php echo ($img->gallerylink() == '' ? $img->url() : $img->gallerylink()) ?>">
          <img src="<?php echo $img ? $img->url() : '' ?>" alt="<?php echo $project->title()->html() ?>" />
        </li>
       <?php endforeach ?>
      </ul>
      <b><?php echo $project->title()->html() ?></b>
      <p><?php echo $project->text()->html() ?></p>
    </div>
  <?php endforeach ?>
</div>
