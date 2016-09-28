  <div class="fullscreen-bg">
    <?php

    // fetch all video formats we need
    $videos = array(
      $site->videos()->find('my-movie.mp4')
    );

    snippet('video', array(
      'videos' => $videos,
      'thumb'  => $page->images()->find('movie.jpg'),
      'controls' => false,
      'autoplay' => true,
      'loop' => true
    ));

    ?>
  </div>
  <?php echo js('assets/build/index.js') ?>
</body>
</html>
