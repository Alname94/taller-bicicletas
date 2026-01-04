package com.alejo.mendez.taller_bicicletas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.alejo.mendez.taller_bicicletas.models.entities.Repuesto;

@Repository
public interface IRepuestoRepository extends JpaRepository<Repuesto, Long>{

    List<Repuesto> findByProductoContainingIgnoreCaseOrMarcaContainingIgnoreCase(String query, String query2);

    boolean existsById(Long codigo);
}
