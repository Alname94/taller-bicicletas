package com.alejo.mendez.taller_bicicletas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alejo.mendez.taller_bicicletas.models.entities.Detalle;
import com.alejo.mendez.taller_bicicletas.models.entities.DetalleId;
import com.alejo.mendez.taller_bicicletas.models.entities.Presupuesto;
import com.alejo.mendez.taller_bicicletas.models.entities.Repuesto;
import com.alejo.mendez.taller_bicicletas.repositories.IDetalleRepository;
import com.alejo.mendez.taller_bicicletas.repositories.IPresupuestoRepository;
import com.alejo.mendez.taller_bicicletas.repositories.IRepuestoRepository;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IDetalleService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class DetalleService implements IDetalleService {

    @Autowired
    private IDetalleRepository detalleRepository;

    @Autowired
    private IPresupuestoRepository presupuestoRepository;

    @Autowired
    private IRepuestoRepository repuestoRepository;

    public DetalleService(IDetalleRepository detalleRepository, IPresupuestoRepository presupuestoRepository, IRepuestoRepository repuestoRepository) {
        this.detalleRepository = detalleRepository;
        this.presupuestoRepository = presupuestoRepository;
        this.repuestoRepository = repuestoRepository;
    }

    @Override
    public List<Detalle> getDetalles() {
        List<Detalle> detalles = detalleRepository.findAll();
        return detalles;
    }

    @Override
    @Transactional
    public Detalle saveDetalle(Detalle detalle) {
        DetalleId id = detalle.getId(); 
        Long repuestoCodigo = id.getRepuestoCodigo(); 
        Long presupuestoNumero = id.getPresupuestoNumero();

        if (detalleRepository.existsById(id)) {
            // Si ya existe un Detalle con este ID, lanzamos la excepción
            throw new IllegalArgumentException("El repuesto (código: " + id.getRepuestoCodigo() + 
                                                  ") ya fue agregado al presupuesto (número: " + id.getPresupuestoNumero() + 
                                                  "). Por favor, elimine el detalle existente antes de crear uno nuevo.");
        }
        
        Repuesto repuesto = repuestoRepository.findById(repuestoCodigo)
            .orElseThrow(() -> new EntityNotFoundException("El repuesto con código " + repuestoCodigo + " no fue encontrado."));

        Presupuesto presupuesto = presupuestoRepository.findById(presupuestoNumero)
            .orElseThrow(() -> new IllegalStateException("El presupuesto Nro. " + presupuestoNumero + " no fue encontrado."));    

        int cantidadAAgregar = detalle.getCantidadAgregada();

        if (repuesto.getStock() < cantidadAAgregar) {
            throw new EntityNotFoundException("Stock insuficiente para el repuesto " + repuesto.getCodigo() + 
                                                  ". Stock actual: " + repuesto.getStock() + 
                                                  ", Cantidad requerida: " + cantidadAAgregar);
        }

        double costoDetalle = cantidadAAgregar * repuesto.getPrecioVenta();
        
        //Sumar al valor total del Presupuesto
        presupuesto.setValorTotal(presupuesto.getValorTotal() + costoDetalle);

        //Actualizar el Stock del Repuesto
        repuesto.setStock(repuesto.getStock() - cantidadAAgregar);
        
        //Guardar el nuevo Detalle
        return detalleRepository.save(detalle);
    }

    @Override
    @Transactional
    public void deleteDetalle(Long presupuestoNumero, Long repuestoCodigo) {
        DetalleId detalleId = new DetalleId(presupuestoNumero, repuestoCodigo);
        Detalle detalleExistente = detalleRepository.findById(detalleId)
            .orElseThrow(() -> new IllegalStateException("El detalle a eliminar no fue encontrado con Presupuesto Nro: " + 
                                                         presupuestoNumero + " y Repuesto Cód: " + repuestoCodigo));

        // 2. Obtener la cantidad y el Repuesto
        Repuesto repuesto = detalleExistente.getRepuesto();
        Presupuesto presupuesto = detalleExistente.getPresupuesto();
        int cantidadDevuelta = detalleExistente.getCantidadAgregada();
        double costoDetalle = cantidadDevuelta * repuesto.getPrecioVenta();
        
        //Actualizar el Stock del Repuesto y restar el precio del valorTotal del presupuesto
        presupuesto.setValorTotal(presupuesto.getValorTotal() - costoDetalle);
        repuesto.setStock(repuesto.getStock() + cantidadDevuelta);
        detalleRepository.delete(detalleExistente);
    }

    @Override
    public Detalle getDetalle(Long presupuestoNumero, Long repuestoCodigo) {
        Optional<Detalle> detalle = detalleRepository.findById(new DetalleId(presupuestoNumero, repuestoCodigo));
        if (detalle.isPresent()) {
            return detalle.get();
        }
        throw new IllegalArgumentException("El detalle con presupuesto numero " + presupuestoNumero + " y repuesto codigo " + repuestoCodigo + " no existe");
    }

    // @Override
    // public Detalle editDetalle(Detalle detalle) {
    //     Detalle detalleExistente = getDetalle(detalle.getPresupuesto().getNumero(), detalle.getRepuesto().getCodigo());
    //     if (detalleExistente != null) {
    //         detalleExistente.setCantidadAgregada(detalle.getCantidadAgregada());
    //         return detalleRepository.save(detalleExistente);
    //     } else {
    //         throw new IllegalArgumentException("El detalle con presupuesto numero " + detalle.getPresupuesto().getNumero() + " y repuesto codigo " + detalle.getRepuesto().getCodigo() + " no existe");
    //     }
    // }

    @Override
    public List<Detalle> findByPresupuestoNumero(Long presupuestoNumero) {
        List<Detalle> detalles = detalleRepository.findByPresupuestoNumero(presupuestoNumero);
        if (detalles.isEmpty()) {
            throw new IllegalArgumentException("Detalle no encontrado");
        }
        return detalles;
    }
}
