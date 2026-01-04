package com.alejo.mendez.taller_bicicletas.services.interfaces;

import java.util.List;

import com.alejo.mendez.taller_bicicletas.models.entities.Presupuesto;

public interface IPresupuestoService {

    public List<Presupuesto> getPresupuestos();

    public Presupuesto savePresupuesto(Presupuesto presupuesto);

    public Presupuesto getPresupuestoById(Long numero);

    public void deletePresupuesto(Long numero);

    public Presupuesto editPresupuesto(Presupuesto presupuesto);

    public List<Presupuesto> findByClienteNombreContainingIgnoreCaseOrBicicletaMarcaContainingIgnoreCase(String query, String query2);

    public List<Presupuesto> findByBicicletaId(Long bicicletaId);
}
