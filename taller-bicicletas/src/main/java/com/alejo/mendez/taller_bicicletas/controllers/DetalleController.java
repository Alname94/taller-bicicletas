package com.alejo.mendez.taller_bicicletas.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alejo.mendez.taller_bicicletas.models.entities.Detalle;
import com.alejo.mendez.taller_bicicletas.models.entities.Presupuesto;
import com.alejo.mendez.taller_bicicletas.models.entities.Repuesto;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IDetalleService;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IPresupuestoService;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IRepuestoService;


@RestController
@RequestMapping("/html/detalles")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE })
public class DetalleController {

    @Autowired
    private IDetalleService detalleService;

    @Autowired
    private IPresupuestoService presupuestoService;

    @Autowired
    private IRepuestoService repuestoService;

    @GetMapping
    public ResponseEntity<List<Detalle>> getDetalles() {
        try {
            List<Detalle> detalles = detalleService.getDetalles();
            return ResponseEntity.ok(detalles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearDetalle(@RequestBody Detalle detalle) {
        try {
            Long presupuestoNumero = detalle.getId().getPresupuestoNumero();
            Long repuestoCodigo = detalle.getId().getRepuestoCodigo();
            Presupuesto presupuesto = presupuestoService.getPresupuestoById(presupuestoNumero);
            Repuesto repuesto = repuestoService.getRepuesto(repuestoCodigo);
            detalle.setPresupuesto(presupuesto);
            detalle.setRepuesto(repuesto);
            Detalle nuevoDetalle = detalleService.saveDetalle(detalle);
            return ResponseEntity.ok(nuevoDetalle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el detalle");
        }
    }

    @DeleteMapping("/borrar/{presupuestoNumero}/{repuestoCodigo}")
    public ResponseEntity<String> borrarDetalle(@PathVariable Long presupuestoNumero,
            @PathVariable Long repuestoCodigo) {
        try {
            detalleService.deleteDetalle(presupuestoNumero, repuestoCodigo);
            return ResponseEntity.ok("Detalle eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al eliminar el detalle: " + e.getMessage());
        }
    }

    @GetMapping("/{presupuestoNumero}/{repuestoCodigo}")
    public ResponseEntity<?> buscarDetalle(@PathVariable Long presupuestoNumero, @PathVariable Long repuestoCodigo) {
        try {
            Detalle detalle = detalleService.getDetalle(presupuestoNumero, repuestoCodigo);
            return ResponseEntity.ok(detalle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // @PutMapping("/editar/{presupuestoNumero}/{repuestoCodigo}")
    // public ResponseEntity<?> editarDetalle(@PathVariable Long presupuestoNumero, @PathVariable Long repuestoCodigo, @RequestBody Detalle detalle) {
    //     try {
    //         presupuestoNumero = detalle.getId().getPresupuestoNumero();
    //         repuestoCodigo = detalle.getId().getRepuestoCodigo();
    //         Presupuesto presupuesto = presupuestoService.getPresupuestoById(presupuestoNumero);
    //         Repuesto repuesto = repuestoService.getRepuesto(repuestoCodigo);
    //         detalle.setPresupuesto(presupuesto);
    //         detalle.setRepuesto(repuesto);
    //         Detalle detalleActualizado = detalleService.editDetalle(detalle);
    //         return ResponseEntity.ok(detalleActualizado);
    //     } catch (IllegalArgumentException e) {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al editar el detalle");
    //     }
    // }

    @GetMapping("/buscar/{presupuestoNumero}")
    public ResponseEntity<?> buscarDetallePorPresupuesto(@PathVariable Long presupuestoNumero){
        try {
            List<Detalle> detalles = detalleService.findByPresupuestoNumero(presupuestoNumero);
            return ResponseEntity.ok(detalles);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

