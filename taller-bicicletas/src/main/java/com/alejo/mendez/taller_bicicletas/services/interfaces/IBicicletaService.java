package com.alejo.mendez.taller_bicicletas.services.interfaces;

import java.util.List;

import com.alejo.mendez.taller_bicicletas.models.entities.Bicicleta;

public interface IBicicletaService {

    public List<Bicicleta> getBicicletas();

    public Bicicleta saveBicicleta(Bicicleta bicicleta);

    public void deleteBicicleta(Long id);

    public Bicicleta getBicicleta(Long id);

    public Bicicleta editBicicleta(Bicicleta bicicleta);

    public List<Bicicleta> findByMarcaContainingIgnoreCase(String marca);

    public List<Bicicleta> findByClienteId(Long clienteId);

    public List<Bicicleta> findByFechaEgresoIsNull();
}
