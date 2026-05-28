<?php

/** @var \App\Model\Samochod $samochod */
/** @var \App\Service\Router $router */

$title = "Edytuj Samochód {$samochod->pobierzMarke()} {$samochod->pobierzModel()} ({$samochod->pobierzId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('car-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="car-edit">
        <input type="hidden" name="id" value="<?= $samochod->pobierzId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('car-index') ?>">Powrót do listy</a></li>
        <li>
            <form action="<?= $router->generatePath('car-delete') ?>" method="post">
                <input type="submit" value="Usuń Samochód" onclick="return confirm('Czy jesteś pewny?')">
                <input type="hidden" name="action" value="car-delete">
                <input type="hidden" name="id" value="<?= $samochod->pobierzId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

