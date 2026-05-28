<?php
    /** @var $samochod ?\App\Model\Samochod */
?>

<div class="form-group">
    <label for="marka">Marka</label>
    <input type="text" id="marka" name="samochod[marka]" value="<?= $samochod ? $samochod->pobierzMarke() : '' ?>">
</div>

<div class="form-group">
    <label for="model">Model</label>
    <input type="text" id="model" name="samochod[model]" value="<?= $samochod ? $samochod->pobierzModel() : '' ?>">
</div>

<div class="form-group">
    <label for="rok">Rocznik</label>
    <input type="number" id="rok" name="samochod[rok]" value="<?= $samochod ? $samochod->pobierzRok() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Zapisz">
</div>
