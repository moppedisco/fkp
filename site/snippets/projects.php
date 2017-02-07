<div class="project-list">
  <?php echo $page->text()->kirbytext() ?>
  <?php foreach($page->children() as $project): ?>
    <?php $img = $project->images()->find($project->cover()); ?>
    <div class='project-list__item'>
      <a data-barba-link-type='projects' href="<?php echo $project->url() ?>">
        <?php if($img): ?>
          <img src="<?php echo $img ? $img->url() : '' ?>" alt="<?php echo $project->title()->html() ?>" />
        <?php endif ?>
        <b><?php echo $project->title()->html() ?></b>
      </a>
    </div>
  <?php endforeach ?>
</div>
