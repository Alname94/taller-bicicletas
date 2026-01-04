package com.alejo.mendez.taller_bicicletas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alejo.mendez.taller_bicicletas.models.entities.Detalle;
import com.alejo.mendez.taller_bicicletas.models.entities.DetalleId;

@Repository
public interface IDetalleRepository extends JpaRepository<Detalle, DetalleId>{
    
    List<Detalle> findByPresupuestoNumero(Long presupuestoNumero);
}

