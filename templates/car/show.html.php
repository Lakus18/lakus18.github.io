<?php

/** @var \App\Model\Samochod $samochod */
/** @var \App\Service\Router $router */

$title = "{$samochod->pobierzMarke()} {$samochod->pobierzModel()} ({$samochod->pobierzId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $samochod->pobierzMarke() ?> <?= $samochod->pobierzModel() ?></h1>
    <article>
        <p><strong>Rocznik:</strong> <?= $samochod->pobierzRok(); ?></p>
    </article>

    <ul class="action-list">
        <li> <a href="<?= $router->generatePath('car-index') ?>">Powrót do listy</a></li>
        <li><a href="<?= $router->generatePath('car-edit', ['id'=> $samochod->pobierzId()]) ?>">Edytuj</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';

