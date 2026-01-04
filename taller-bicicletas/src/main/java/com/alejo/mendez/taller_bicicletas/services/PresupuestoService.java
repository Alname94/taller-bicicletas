package com.alejo.mendez.taller_bicicletas.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alejo.mendez.taller_bicicletas.models.entities.Bicicleta;
import com.alejo.mendez.taller_bicicletas.models.entities.Cliente;
import com.alejo.mendez.taller_bicicletas.models.entities.Presupuesto;
import com.alejo.mendez.taller_bicicletas.repositories.IBicicletaRepository;
import com.alejo.mendez.taller_bicicletas.repositories.IClienteRepository;
import com.alejo.mendez.taller_bicicletas.repositories.IPresupuestoRepository;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IPresupuestoService;


@Service
public class PresupuestoService implements IPresupuestoService {

    @Autowired
    private IPresupuestoRepository presupuestoRepository;

    @Autowired
    private IClienteRepository clienteRepository;

    @Autowired
    private IBicicletaRepository bicicletaRepository;

    @Override
    public List<Presupuesto> getPresupuestos() {
        List<Presupuesto> presupuestos = presupuestoRepository.findAll();
        return presupuestos;
    }

    // permite crear un repuesto
    // validaciones para fecha, cliente, bicicleta y relación existente
    @Override
    public Presupuesto savePresupuesto(Presupuesto presupuesto) {
        // Validar existencia de Cliente
        if (presupuesto.getCliente() == null || !clienteRepository.existsById(presupuesto.getCliente().getId())) {
            throw new IllegalArgumentException("El cliente especificado no existe.");
        }

        // Validar existencia de Bicicleta
        if (presupuesto.getBicicleta() == null || !bicicletaRepository.existsById(presupuesto.getBicicleta().getId())) {
            throw new IllegalArgumentException("La bicicleta especificada no existe.");
        }

        // Validar relación Cliente-Bicicleta
        Bicicleta bicicleta = bicicletaRepository.findById(presupuesto.getBicicleta().getId()).orElseThrow();
        if (!bicicleta.getCliente().getId().equals(presupuesto.getCliente().getId())) {
            throw new IllegalArgumentException("La bicicleta no pertenece al cliente especificado.");
        }

        // Validar Fecha
        if (presupuesto.getFecha().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("La fecha del presupuesto no puede ser futura.");
        }
        return presupuestoRepository.save(presupuesto);
    }

    @Override
    public Presupuesto getPresupuestoById(Long numero) {
        Optional<Presupuesto> presupuesto = presupuestoRepository.findById(numero);
        if (presupuesto.isPresent()) {
            return presupuesto.get();
        }
        throw new IllegalArgumentException("El presupuesto con numero " + numero + " no existe");
    }

    @Override
    public void deletePresupuesto(Long numero) {
        Presupuesto presupuestoExistente = getPresupuestoById(numero);
        if (presupuestoExistente == null) {
            throw new IllegalArgumentException("El presupuesto con numero " + numero + " no existe.");
        }
        presupuestoRepository.deleteById(numero);
    }

    //aunque ciertos atributos van a ser readonly o controlados por el front, realizo las validaciones necesarias
    @Override
    public Presupuesto editPresupuesto(Presupuesto presupuesto) {
        Presupuesto presupuestoExistente = presupuestoRepository.findById(presupuesto.getNumero())
                .orElseThrow(() -> new IllegalArgumentException(
                        "El presupuesto con numero " + presupuesto.getNumero() + " no existe"));

        Cliente nuevoCliente = presupuesto.getCliente();
        if (nuevoCliente != null && !clienteRepository.existsById(nuevoCliente.getId())) {
            throw new IllegalArgumentException("El cliente especificado no existe.");
        }

        Bicicleta nuevaBicicleta = null;
        if (presupuesto.getBicicleta() != null) {
            nuevaBicicleta = bicicletaRepository.findById(presupuesto.getBicicleta().getId())
                    .orElseThrow(() -> new IllegalArgumentException("La bicicleta especificada no existe."));
        }

        //Validar la relación Cliente-Bicicleta
        if (nuevoCliente != null && nuevaBicicleta != null) {
            // Comparar el ID del cliente que llega en el presupuesto con el ID del dueño de la bicicleta.
            if (!nuevoCliente.getId().equals(nuevaBicicleta.getCliente().getId())) {
                throw new IllegalArgumentException("La bicicleta no pertenece al cliente especificado.");
            }
        }
        presupuestoExistente.setFecha(presupuesto.getFecha());
        presupuestoExistente.setCliente(presupuesto.getCliente());
        presupuestoExistente.setBicicleta(presupuesto.getBicicleta());
        presupuestoExistente.setValorTotal(presupuesto.getValorTotal());
        presupuestoExistente.setDescripcion(presupuesto.getDescripcion());
        return presupuestoRepository.save(presupuestoExistente);
    }

    @Override
    public List<Presupuesto> findByClienteNombreContainingIgnoreCaseOrBicicletaMarcaContainingIgnoreCase(String query,
            String query2) {
        List<Presupuesto> presupuestos = presupuestoRepository
                .findByClienteNombreContainingIgnoreCaseOrBicicletaMarcaContainingIgnoreCase(query, query2);
        if (presupuestos.isEmpty()) {
            throw new IllegalArgumentException("No existen presupuestos con " + query);
        } else {
            return presupuestos;
        }
    }

    @Override
    public List<Presupuesto> findByBicicletaId(Long bicicletaId) {
        List<Presupuesto> presupuestos = presupuestoRepository.findByBicicletaId(bicicletaId);
        if (presupuestos.isEmpty()) {
            throw new IllegalArgumentException("No existen presupuestos para la bicicleta con id " + bicicletaId);
        } else {
            return presupuestos;
        }
    }
}
