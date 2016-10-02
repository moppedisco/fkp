<?php
// selective items
$leftcol = $pages->find('fkp')->children();
if($leftcol and $leftcol->count()):
?>
<nav class='main-nav left-nav' role="navigation">
  <a class='back-home' href="<?php echo url() ?>/"><?php echo $pages->find('fkp')->title() ?></a>
  <ul>
    <?php foreach($leftcol as $item): ?>
    <li <?php e($item->isOpen(), ' class="active"') ?>><a href="<?php echo $item->url() ?>"><?php echo $item->title()->html() ?></a></li>
    <?php endforeach ?>
  </ul>
</nav>
<?php endif ?>

<?php
// selective items
$rightcol = $pages->find('other-people-magazine')->children();
if($rightcol and $rightcol->count()):
?>
<nav class='main-nav right-nav' role="navigation">
  <a class='back-home' href="<?php echo url() ?>/"><?php echo $pages->find('other-people-magazine')->title() ?></a>
  <ul>
    <?php foreach($rightcol as $item): ?>
    <li <?php e($item->isOpen(), ' class="active"') ?>><a href="<?php echo $item->url() ?>"><?php echo $item->title()->html() ?></a></li>
    <?php endforeach ?>
  </ul>
</nav>
<?php endif ?>
