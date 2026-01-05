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

import com.alejo.mendez.taller_bicicletas.models.entities.Repuesto;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IRepuestoService;

@RestController
@RequestMapping("/html/repuestos")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE })
public class RepuestoController {

    @Autowired
    private IRepuestoService repuestoService;

    @GetMapping
    public ResponseEntity<List<Repuesto>> getRepuestos(){
        try {
            List<Repuesto> repuestos = repuestoService.getRepuestos();
            return ResponseEntity.ok(repuestos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearRepuesto(@RequestBody Repuesto repuesto){
        try {
            Repuesto nuevoRepuesto = repuestoService.saveRepuesto(repuesto);
            return ResponseEntity.ok(nuevoRepuesto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el repuesto");
        }
    }

    @DeleteMapping("/borrar/{codigo}")
    public ResponseEntity<String> borrarRepuesto(@PathVariable Long codigo){
        try {
            repuestoService.deleteRepuesto(codigo);
            return ResponseEntity.ok("Repuesto codigo: " + codigo + " eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el presupuesto: " + e.getMessage());
        }
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<?> buscarRepuestoPorCodigo(@PathVariable Long codigo){
        try {
            Repuesto repuesto = repuestoService.getRepuesto(codigo);
            return ResponseEntity.ok(repuesto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/editar/{codigo}")
    public ResponseEntity<?> editarRepuesto(@PathVariable Long codigo, @RequestBody Repuesto repuesto){
        try {
            repuesto.setCodigo(codigo);
            Repuesto repuestoActualizado = repuestoService.editRepuesto(repuesto);
            return ResponseEntity.ok(repuestoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al editar el repuesto");
        }
    }

    @GetMapping("/buscar/{query}")
    public ResponseEntity<?> buscarRepuestoPorProductoOMarca(@PathVariable String query){
        try {
            List<Repuesto> repuestos = repuestoService.findByProductoContainingIgnoreCaseOrMarcaContainingIgnoreCase(query, query);
            return ResponseEntity.ok(repuestos);
        } catch (IllegalArgumentException e) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
