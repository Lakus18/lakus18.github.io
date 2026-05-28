<?php
namespace App\Model;

use App\Service\Config;

class Samochod
{
    private ?int $id = null;
    private ?string $marka = null;
    private ?string $model = null;
    private ?int $rok = null;

    public function pobierzId(): ?int
    {
        return $this->id;
    }

    public function ustawId(?int $id): Samochod
    {
        $this->id = $id;
        return $this;
    }

    public function pobierzMarke(): ?string
    {
        return $this->marka;
    }

    public function ustawMarke(?string $marka): Samochod
    {
        $this->marka = $marka;
        return $this;
    }

    public function pobierzModel(): ?string
    {
        return $this->model;
    }

    public function ustawModel(?string $model): Samochod
    {
        $this->model = $model;
        return $this;
    }

    public function pobierzRok(): ?int
    {
        return $this->rok;
    }

    public function ustawRok(?int $rok): Samochod
    {
        $this->rok = $rok;
        return $this;
    }

    public static function zRozkladu($tablica): Samochod
    {
        $samochod = new self();
        $samochod->wypelnij($tablica);
        return $samochod;
    }

    public function wypelnij($tablica): Samochod
    {
        if (isset($tablica['id']) && !$this->pobierzId()) {
            $this->ustawId($tablica['id']);
        }
        if (isset($tablica['marka'])) {
            $this->ustawMarke($tablica['marka']);
        }
        if (isset($tablica['brand'])) {
            $this->ustawMarke($tablica['brand']);
        }
        if (isset($tablica['model'])) {
            $this->ustawModel($tablica['model']);
        }
        if (isset($tablica['rok'])) {
            $this->ustawRok($tablica['rok']);
        }
        if (isset($tablica['year'])) {
            $this->ustawRok($tablica['year']);
        }
        return $this;
    }

    public static function pobierzWszystkie(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $samochody = [];
        $tablicaSamochodow = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($tablicaSamochodow as $tablicaSamochodu) {
            $samochody[] = self::zRozkladu($tablicaSamochodu);
        }

        return $samochody;
    }

    public static function pobierz($id): ?Samochod
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $tablicaSamochodu = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$tablicaSamochodu) {
            return null;
        }
        $samochod = Samochod::zRozkladu($tablicaSamochodu);

        return $samochod;
    }

    public function zapisz(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->pobierzId()) {
            $sql = "INSERT INTO car (brand, model, year) VALUES (:brand, :model, :year)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'brand' => $this->pobierzMarke(),
                'model' => $this->pobierzModel(),
                'year' => $this->pobierzRok(),
            ]);

            $this->ustawId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE car SET brand = :brand, model = :model, year = :year WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':brand' => $this->pobierzMarke(),
                ':model' => $this->pobierzModel(),
                ':year' => $this->pobierzRok(),
                ':id' => $this->pobierzId(),
            ]);
        }
    }

    public function usun(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM car WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->pobierzId(),
        ]);

        $this->ustawId(null);
        $this->ustawMarke(null);
        $this->ustawModel(null);
        $this->ustawRok(null);
    }
}

