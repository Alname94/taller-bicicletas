package com.alejo.mendez.taller_bicicletas.services.interfaces;

import java.util.List;

import com.alejo.mendez.taller_bicicletas.models.entities.Detalle;

public interface IDetalleService {

    public List<Detalle> getDetalles();

    public Detalle saveDetalle(Detalle detalle);

    public void deleteDetalle(Long presupuestoNumero, Long repuestoCodigo);

    public Detalle getDetalle(Long presupuestoNumero, Long repuestoCodigo);

    // public Detalle editDetalle(Detalle detalle); omito este edit ya que desde el front no se utilizará y editar estos datos puede traer problemas

    public List<Detalle> findByPresupuestoNumero(Long presupuestoNumero);
}
