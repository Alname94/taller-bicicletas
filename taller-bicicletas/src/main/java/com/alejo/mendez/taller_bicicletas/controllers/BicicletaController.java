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

import com.alejo.mendez.taller_bicicletas.models.entities.Bicicleta;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IBicicletaService;

@RestController
@RequestMapping("/html/bicicletas")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE })
public class BicicletaController {

    @Autowired
    private IBicicletaService bicicletaService;

    @GetMapping
    public ResponseEntity<List<Bicicleta>> getBicicletas(){
        try {
            List<Bicicleta> bicicletas = bicicletaService.getBicicletas();
            return ResponseEntity.ok(bicicletas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearBicicleta(@RequestBody Bicicleta bicicleta){
        try {
            Bicicleta nuevaBicicleta = bicicletaService.saveBicicleta(bicicleta);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaBicicleta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());        
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la bicicleta");
        }
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<String> borrarBicicleta(@PathVariable Long id){
        try {
            bicicletaService.deleteBicicleta(id);
            return ResponseEntity.ok("Bicicleta con id " + id + " eliminada correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la bicicleta: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarBicicletaPorId(@PathVariable Long id){
        try {
            Bicicleta bicicleta = bicicletaService.getBicicleta(id);
            return ResponseEntity.ok(bicicleta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editarBicicleta(@PathVariable Long id, @RequestBody Bicicleta bicicleta){
        try {
            bicicleta.setId(id);
            Bicicleta bicicletaActualizada = bicicletaService.editBicicleta(bicicleta);
            return ResponseEntity.ok(bicicletaActualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al editar la bicicleta");
        }
    }

    @GetMapping("/buscar/marca/{marca}")
    public ResponseEntity<?> buscarBicicletasPorMarca(@PathVariable String marca){
        try {
            List<Bicicleta> bicicletas = bicicletaService.findByMarcaContainingIgnoreCase(marca);
            return ResponseEntity.ok(bicicletas);            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/buscar/cliente/{clienteId}")
    public ResponseEntity<?> buscarBicicletasPorClienteId(@PathVariable Long clienteId){
        try {
            List<Bicicleta> bicicletas = bicicletaService.findByClienteId(clienteId);
            return ResponseEntity.ok(bicicletas);            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

