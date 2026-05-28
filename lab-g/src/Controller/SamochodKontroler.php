<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Samochod;
use App\Service\Router;
use App\Service\Templating;

class SamochodKontroler
{
    public function akcjaLista(Templating $szablonowanie, Router $router): ?string
    {
        $samochody = Samochod::pobierzWszystkie();
        $html = $szablonowanie->render('car/index.html.php', [
            'samochody' => $samochody,
            'router' => $router,
        ]);
        return $html;
    }

    public function akcjaUtworzenie(?array $zaptanieSamochod, Templating $szablonowanie, Router $router): ?string
    {
        if ($zaptanieSamochod) {
            $samochod = Samochod::zRozkladu($zaptanieSamochod);
            $samochod->zapisz();

            $sciezka = $router->generatePath('car-index');
            $router->redirect($sciezka);
            return null;
        } else {
            $samochod = new Samochod();
        }

        $html = $szablonowanie->render('car/create.html.php', [
            'samochod' => $samochod,
            'router' => $router,
        ]);
        return $html;
    }

    public function akcjaEdycja(int $idSamochodu, ?array $zaptanieSamochod, Templating $szablonowanie, Router $router): ?string
    {
        $samochod = Samochod::pobierz($idSamochodu);
        if (!$samochod) {
            throw new NotFoundException("Brakuje samochodu o id $idSamochodu");
        }

        if ($zaptanieSamochod) {
            $samochod->wypelnij($zaptanieSamochod);
            $samochod->zapisz();

            $sciezka = $router->generatePath('car-index');
            $router->redirect($sciezka);
            return null;
        }

        $html = $szablonowanie->render('car/edit.html.php', [
            'samochod' => $samochod,
            'router' => $router,
        ]);
        return $html;
    }

    public function akcjaWyswietlanie(int $idSamochodu, Templating $szablonowanie, Router $router): ?string
    {
        $samochod = Samochod::pobierz($idSamochodu);
        if (!$samochod) {
            throw new NotFoundException("Brakuje samochodu o id $idSamochodu");
        }

        $html = $szablonowanie->render('car/show.html.php', [
            'samochod' => $samochod,
            'router' => $router,
        ]);
        return $html;
    }

    public function akcjaUsunięcie(int $idSamochodu, Router $router): ?string
    {
        $samochod = Samochod::pobierz($idSamochodu);
        if (!$samochod) {
            throw new NotFoundException("Brakuje samochodu o id $idSamochodu");
        }

        $samochod->usun();
        $sciezka = $router->generatePath('car-index');
        $router->redirect($sciezka);
        return null;
    }
}

