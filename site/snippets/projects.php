<h2>Work</h2>

<?php foreach(page('work')->children()->visible() as $project): ?>
  <?php if($image = $project->images()->sortBy('sort', 'asc')->first()): ?>
    <img src="<?php echo $image->url() ?>" alt="<?php echo $project->title()->html() ?>" >
  <?php endif ?>
  <b><?php echo $project->title()->html() ?></b>
  <p><?php echo $project->text() ?></p>
<?php endforeach ?>
