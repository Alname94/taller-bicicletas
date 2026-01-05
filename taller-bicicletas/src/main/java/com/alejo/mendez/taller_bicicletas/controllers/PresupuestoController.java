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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alejo.mendez.taller_bicicletas.models.entities.Presupuesto;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IPresupuestoService;

@RestController
@RequestMapping("/html/presupuestos")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE })
public class PresupuestoController {

    @Autowired
    private IPresupuestoService presupuestoService;

    @GetMapping
    public ResponseEntity<List<Presupuesto>> getPresupuestos(){
        try {
            List<Presupuesto> presupuestos = presupuestoService.getPresupuestos();
            return ResponseEntity.ok(presupuestos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearPresupuesto(@RequestBody Presupuesto presupuesto){
        try {
            Presupuesto nuevoPresupuesto = presupuestoService.savePresupuesto(presupuesto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPresupuesto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());        
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el presupuesto");
        }
    }

    @DeleteMapping("/borrar/{numero}")
    public ResponseEntity<String> borrarPresupuesto(@PathVariable Long numero){
        try {
            presupuestoService.deletePresupuesto(numero);
            return ResponseEntity.ok("Presupuesto número: " + numero + " eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el presupuesto: " + e.getMessage());
        }
    }

    @GetMapping("/{numero}")
    public ResponseEntity<?> buscarPresupuestoPorNumero(@PathVariable Long numero){
        try {
            Presupuesto presupuesto = presupuestoService.getPresupuestoById(numero);
            return ResponseEntity.ok(presupuesto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/editar/{numero}")
    public ResponseEntity<?> editarPresupuesto(@PathVariable Long numero, @RequestBody Presupuesto presupuesto){
        try {
            presupuesto.setNumero(numero);
            Presupuesto presupuestoActualizado = presupuestoService.editPresupuesto(presupuesto);
            return ResponseEntity.ok(presupuestoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al editar el presupuesto");
        }
    }

    @GetMapping("/buscar/{query}")
    public ResponseEntity<?> buscarPresupuestoPorClienteNombreOBicicletaMarca(@PathVariable String query){
        try {
            List<Presupuesto> presupuestos = presupuestoService.findByClienteNombreContainingIgnoreCaseOrBicicletaMarcaContainingIgnoreCase(query, query);
            return ResponseEntity.ok(presupuestos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/buscar/bicicleta/{bicicletaId}")
    public ResponseEntity<?> buscarPresupuestoPorBicicletaId(@PathVariable Long bicicletaId){
        try {
            List<Presupuesto> presupuestos = presupuestoService.findByBicicletaId(bicicletaId);
            return ResponseEntity.ok(presupuestos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }    
}
