<?php

/** @var \App\Model\Samochod $samochod */
/** @var \App\Service\Router $router */

$title = 'Utwórz Samochód';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Utwórz Samochód</h1>
    <form action="<?= $router->generatePath('car-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="car-create">
    </form>

    <a href="<?= $router->generatePath('car-index') ?>">Powrót do listy</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

