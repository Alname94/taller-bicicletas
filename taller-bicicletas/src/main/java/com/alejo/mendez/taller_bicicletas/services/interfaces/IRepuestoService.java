package com.alejo.mendez.taller_bicicletas.services.interfaces;

import java.util.List;

import com.alejo.mendez.taller_bicicletas.models.entities.Repuesto;

public interface IRepuestoService {

    public List<Repuesto> getRepuestos();

    public Repuesto saveRepuesto(Repuesto repuesto);

    public void deleteRepuesto(Long codigo);

    public Repuesto getRepuesto(Long codigo);

    public Repuesto editRepuesto(Repuesto repuesto);

    List<Repuesto> findByProductoContainingIgnoreCaseOrMarcaContainingIgnoreCase(String producto, String marca);

}
