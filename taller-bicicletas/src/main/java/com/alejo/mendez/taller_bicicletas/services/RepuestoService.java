package com.alejo.mendez.taller_bicicletas.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alejo.mendez.taller_bicicletas.models.entities.Repuesto;
import com.alejo.mendez.taller_bicicletas.repositories.IRepuestoRepository;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IRepuestoService;

@Service
public class RepuestoService implements IRepuestoService {

    @Autowired
    private IRepuestoRepository repuestoRepository;

    //obtiene todos los repuestos
    @Override
    public List<Repuesto> getRepuestos() {
        List<Repuesto> repuestos = repuestoRepository.findAll();
        return repuestos;
    }

    //permite guardar un repuesto
    //primero verifica si el código ya existe y que los valores de precio no sean 0 o negativos 
    //y luego se redondea utilizando un método privado
    @Override
    public Repuesto saveRepuesto(Repuesto repuesto) {

        if (repuestoRepository.existsById(repuesto.getCodigo())) {
            throw new IllegalArgumentException("El Código ya está registrado.");
        }

        if(repuesto.getCodigo()<=0) {
            throw new IllegalArgumentException("El codigo debe ser un valor positivo y no puede ser cero.");
        }

        if (repuesto.getPrecioCosto() <= 0) {
            throw new IllegalArgumentException("El precio de costo debe ser un valor positivo y no puede ser cero.");
        }
        if (repuesto.getPrecioVenta() <= 0) {
            throw new IllegalArgumentException("El precio de venta debe ser un valor positivo y no puede ser cero.");
        }
        double precioVentaOriginal = repuesto.getPrecioVenta();
        double precioVentaRedondeado = redondearPrecio(precioVentaOriginal);
        repuesto.setPrecioVenta(precioVentaRedondeado);

        double precioCostoOriginal = repuesto.getPrecioCosto();
        double precioCostoRedondeado = redondearPrecio(precioCostoOriginal);
        repuesto.setPrecioCosto(precioCostoRedondeado);
        return repuestoRepository.save(repuesto);
    }

    //elimina repuesto por codigo
    @Override
    public void deleteRepuesto(Long codigo) {
        Repuesto repuestoExistente = getRepuesto(codigo);
        if (repuestoExistente == null) {
            throw new IllegalArgumentException("El repuesto con codigo " + codigo + " no existe.");
        }
        repuestoRepository.deleteById(codigo);
    }

    //búsqueda por código del repuesto
    @Override
    public Repuesto getRepuesto(Long codigo) {
        Optional<Repuesto> repuesto = repuestoRepository.findById(codigo);
        if (repuesto.isPresent()) {
            return repuesto.get();
        }
        throw new IllegalArgumentException("El repuesto con codigo " + codigo + " no existe");
    }

    //permite editar los valores de un repuesto
    //realiza las validaciones y redondeo de precios
    @Override
    public Repuesto editRepuesto(Repuesto repuesto) {
        Repuesto repuestoExistente = getRepuesto(repuesto.getCodigo());
        if (repuestoRepository.existsById(repuesto.getCodigo())) {
            throw new IllegalArgumentException("El Código ya está registrado.");
        }

        if(repuesto.getCodigo()<=0) {
            throw new IllegalArgumentException("El codigo debe ser un valor positivo y no puede ser cero.");
        }

        if (repuesto.getPrecioCosto() == 0 || repuesto.getPrecioCosto() <= 0) {
            throw new IllegalArgumentException("El precio de costo debe ser un valor positivo y no puede ser cero.");
        }
        if (repuesto.getPrecioVenta() == 0 || repuesto.getPrecioVenta() <= 0) {
            throw new IllegalArgumentException("El precio de venta debe ser un valor positivo y no puede ser cero.");
        }
        if (repuestoExistente != null) {
            double precioVentaOriginal = repuesto.getPrecioVenta();
            double precioVentaRedondeado = redondearPrecio(precioVentaOriginal);
            double precioCostoOriginal = repuesto.getPrecioCosto();
            double precioCostoRedondeado = redondearPrecio(precioCostoOriginal);
            repuestoExistente.setProducto(repuesto.getProducto());
            repuestoExistente.setMarca(repuesto.getMarca());
            repuestoExistente.setColor(repuesto.getColor());
            repuestoExistente.setPrecioVenta(precioVentaRedondeado);
            repuestoExistente.setPrecioCosto(precioCostoRedondeado);
            repuestoExistente.setStock(repuesto.getStock());
            return repuestoRepository.save(repuestoExistente);
        } else {
            throw new IllegalArgumentException("El repuesto con codigo " + repuesto.getCodigo() + " no existe");
        }
    }

    //búsqueda por caracteres para producto o marca
    @Override
    public List<Repuesto> findByProductoContainingIgnoreCaseOrMarcaContainingIgnoreCase(String producto, String marca) {
        List<Repuesto> repuestos = repuestoRepository
                .findByProductoContainingIgnoreCaseOrMarcaContainingIgnoreCase(producto, marca);
        if (repuestos.isEmpty()) {
            throw new IllegalArgumentException("No existen repuestos con el nombre que contiene: " + producto);
        } else {
            return repuestos;
        }
    }

    /**
     * Metodo privado para redondear los precios
     * @param precio
     * @return
     */
    private double redondearPrecio(double precio) {
        // Convertir double a String y luego a BigDecimal para evitar errores de punto flotante
        BigDecimal bd = new BigDecimal(Double.toString(precio));

        // Redondear a 2 decimales usando HALF_UP
        bd = bd.setScale(2, RoundingMode.HALF_UP);

        // Devolver el valor redondeado como double
        return bd.doubleValue();
    }
}