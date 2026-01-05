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
import org.springframework.web.bind.annotation.RestController;

import com.alejo.mendez.taller_bicicletas.models.entities.Cliente;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IClienteService;

import org.springframework.web.bind.annotation.RequestMethod;

@RestController
@RequestMapping("/html/clientes")
@CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
        RequestMethod.DELETE })
public class ClienteController {

    @Autowired
    private IClienteService clienteService;

    @GetMapping
    public ResponseEntity<List<Cliente>> getClientes(){
        try {
            List<Cliente> clientes = clienteService.getClientes();
            return ResponseEntity.ok(clientes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearCliente(@RequestBody Cliente cliente){
        try {
            Cliente nuevoCliente = clienteService.saveCliente(cliente);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCliente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());        
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el cliente");
        }
    }

    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<String> borrarCliente(@PathVariable Long id){
        try {
            clienteService.deleteCliente(id);
            return ResponseEntity.ok("Cliente con id " + id + " eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar el cliente: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarClientePorId(@PathVariable Long id){
        try {
            Cliente cliente = clienteService.findCliente(id);
            return ResponseEntity.ok(cliente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/editar/{id}")
    public ResponseEntity<?> editCliente(@PathVariable Long id, @RequestBody Cliente cliente){
        try {
            cliente.setId(id);
            Cliente clienteActualizado = clienteService.editCliente(cliente);
            return ResponseEntity.ok(clienteActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/buscar/nombre/{nombre}")
    public ResponseEntity<?> buscarClientePorNombre(@PathVariable String nombre){
        try {
            List<Cliente> clientes = clienteService.findByNombreContainingIgnoreCase(nombre);
            return ResponseEntity.ok(clientes);            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/buscar/dni/{dni}")
    public ResponseEntity<?> buscarClientePorDni(@PathVariable String dni){
        try {
            Cliente cliente = clienteService.findByDni(dni).get();
            return ResponseEntity.ok(cliente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}