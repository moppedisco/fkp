<div class="project-list">
  <?php echo $page->text()->kirbytext() ?>
  <?php foreach($page->children() as $project): ?>
    <div class="project-list__item">
      <?php if($project->images() && !$project->video()): ?>
        <div class="project-list-images">
          <?php foreach($project->images() as $image): ?>
            <div class="project-list-image" data-src="<?php echo $image->url() ?>">
              <img src="<?php echo $image->url() ?>" alt="<?php echo $project->title()->html() ?>" >
            </div>
          <?php endforeach ?>
        </div>
      <?php elseif($project->images() && $project->video()): ?>
        <div id="video1" style='display: none;'>
          <?php

          // fetch all video formats we need
          $videos = array(
            $project->video()
          );

          snippet('video', array(
            'videos' => $videos,
            'controls' => true,
            'autoplay' => false,
            'preload' => false,
            'loop' => false,
            'cssClasses' => 'lg-video-object lg-html5'
          ));
          ?>
        </div>
        <div class="project-list-images">
          <?php $i = 1; ?>
          <?php foreach($project->images() as $image): ?>
            <div class="project-list-image" <?php echo ($i == 1 ? "data-html='#video1'" : "data-src='".$image->url()."'"); ?>>
              <img src="<?php echo $image->url() ?>" alt="<?php echo $project->title()->html() ?>" >
            </div>
            <?php $i++; ?>
          <?php endforeach ?>
        </div>
      <?php endif ?>
      <b><?php echo $project->title()->html() ?></b>
    </div>
  <?php endforeach ?>
</div>
