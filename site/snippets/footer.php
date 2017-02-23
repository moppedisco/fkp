  <div class="fullscreen-bg">

    <?php

    // fetch all video formats we need
    $videos = array(
      $site->videos()->first()
    );

    snippet('video', array(
      'videos' => $videos,
      'thumb'  => $site->images()->first(),
      'controls' => false,
      'autoplay' => true,
      'loop' => true
    ));

    ?>
  </div>
  <?php echo js('assets/build/index.js') ?>
</body>
</html>
