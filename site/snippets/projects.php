<div class="project-list">
  <?php foreach($page->children() as $project): ?>
    <div class="project-list__item">
      <?php if($project->images()): ?>
        <div class="project-list-images">
          <?php foreach($project->images() as $image): ?>
            <div class="project-list-image" data-src="<?php echo $image->url() ?>">
              <img src="<?php echo $image->url() ?>" alt="<?php echo $project->title()->html() ?>" >
            </div>
          <?php endforeach ?>
        </div>
      <?php endif ?>
      <b><?php echo $project->title()->html() ?></b>
    </div>
  <?php endforeach ?>
</div>
