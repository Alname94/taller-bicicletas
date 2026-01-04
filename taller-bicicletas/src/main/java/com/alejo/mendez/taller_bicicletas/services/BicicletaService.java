package com.alejo.mendez.taller_bicicletas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alejo.mendez.taller_bicicletas.models.entities.Bicicleta;
import com.alejo.mendez.taller_bicicletas.repositories.IBicicletaRepository;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IBicicletaService;


@Service
public class BicicletaService implements IBicicletaService {

    @Autowired
    private IBicicletaRepository bicicletaRepository;

    //obtiene todas las bicicletas
    @Override
    public List<Bicicleta> getBicicletas() {
        List<Bicicleta> bicicletas = bicicletaRepository.findAll();
        return bicicletas;
    }

    @Override
    public Bicicleta saveBicicleta(Bicicleta bicicleta) {
        return bicicletaRepository.save(bicicleta);
    }

    //eliminar bicicleta por id
    @Override
    public void deleteBicicleta(Long id) {
        Bicicleta bicicletaExistente = getBicicleta(id);
        if (bicicletaExistente == null) {
            throw new IllegalArgumentException("La bicicleta con id " + id + " no existe.");
        }
        bicicletaRepository.deleteById(id);
    }

    //busca bicicleta por id
    @Override
    public Bicicleta getBicicleta(Long id) {
        Optional<Bicicleta> bicicleta = bicicletaRepository.findById(id);
        if (bicicleta.isPresent()) {
            return bicicleta.get();
        }
        throw new IllegalArgumentException("La bicicleta con id " + id + " no existe");
    }

    //Se editan solo los datos de la bicicleta. 
    //Los datos del cliente serán readonly desde la vista para modificar una bicicleta.
    @Override
    public Bicicleta editBicicleta(Bicicleta bicicleta) {
        Bicicleta bicicletaExistente = getBicicleta(bicicleta.getId());
        if (bicicletaExistente != null) {
            bicicletaExistente.setMarca(bicicleta.getMarca());
            bicicletaExistente.setModelo(bicicleta.getModelo());
            bicicletaExistente.setColor(bicicleta.getColor());
            bicicletaExistente.setRodado(bicicleta.getRodado());
            bicicletaExistente.setFechaIngreso(bicicleta.getFechaIngreso());
            bicicletaExistente.setFechaEgreso(bicicleta.getFechaEgreso());
            return bicicletaRepository.save(bicicletaExistente);
        } else {
            throw new IllegalArgumentException("La bicicleta con id " + bicicleta.getId() + " no existe");
        }
    }

    //búsqueda por caracteres de la marca
    @Override
    public List<Bicicleta> findByMarcaContainingIgnoreCase(String marca) {
        List<Bicicleta> bicicletas = bicicletaRepository.findByMarcaContainingIgnoreCase(marca);
        if (bicicletas.isEmpty()) {
            throw new IllegalArgumentException("No se encontraron bicicletas con la marca " + marca);
        }
        return bicicletas;
    }

    //búsqueda por cliente asociado
    @Override
    public List<Bicicleta> findByClienteId(Long clienteId) {
        List<Bicicleta> bicicletas = bicicletaRepository.findByClienteId(clienteId);
        if (bicicletas.isEmpty()) {
            throw new IllegalArgumentException("No se encontraron bicicletas para el cliente con id " + clienteId);
        }
        return bicicletas;
    }

    //búsqueda por fecha de egreso = null
    @Override
    public List<Bicicleta> findByFechaEgresoIsNull() {
        List<Bicicleta> bicicletas = bicicletaRepository.findByFechaEgresoIsNull();
        if (bicicletas.isEmpty()) {
            throw new IllegalArgumentException("No hay bicicletas pendientes");
        }
        return bicicletas;
    }    
}

