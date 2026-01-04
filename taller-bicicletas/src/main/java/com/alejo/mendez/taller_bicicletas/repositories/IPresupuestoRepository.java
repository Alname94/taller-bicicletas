package com.alejo.mendez.taller_bicicletas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alejo.mendez.taller_bicicletas.models.entities.Presupuesto;

@Repository
public interface IPresupuestoRepository extends JpaRepository<Presupuesto, Long>{

    //busqueda por nombre del cliente o marca de la bicicleta
    List<Presupuesto> findByClienteNombreContainingIgnoreCaseOrBicicletaMarcaContainingIgnoreCase(String nombre, String marca);

    List<Presupuesto> findByBicicletaId(Long bicicletaId);

}
