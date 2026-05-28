<?php

/** @var \App\Model\Samochod[] $samochody */
/** @var \App\Service\Router $router */

$title = 'Lista Samochodów';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Lista Samochodów</h1>

    <a href="<?= $router->generatePath('car-create') ?>">Dodaj nowy samochód</a>

    <ul class="index-list">
        <?php foreach ($samochody as $samochod): ?>
            <li><h3><?= $samochod->pobierzMarke() ?> <?= $samochod->pobierzModel() ?> (<?= $samochod->pobierzRok() ?>)</h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('car-show', ['id' => $samochod->pobierzId()]) ?>">Szczegóły</a></li>
                    <li><a href="<?= $router->generatePath('car-edit', ['id' => $samochod->pobierzId()]) ?>">Edytuj</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
