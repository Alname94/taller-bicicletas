package com.alejo.mendez.taller_bicicletas.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;

import com.alejo.mendez.taller_bicicletas.models.entities.Cliente;
import com.alejo.mendez.taller_bicicletas.repositories.IClienteRepository;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IClienteService;


@Service
public class ClienteService implements IClienteService {

    @Autowired
    private IClienteRepository clienteRepository;

    //obtiene todos los clientes
    @Override
    public List<Cliente> getClientes() {
        List<Cliente> clientes = clienteRepository.findAll();
        return clientes;
    }

    //Guarda un cliente siempre y cuando cumpla con las validaciones 
    //para evitar valores repetidos de dni, email y teléfono.
    @Override
    public Cliente saveCliente(Cliente cliente) {
        Cliente clienteDni = new Cliente();
        clienteDni.setDni(cliente.getDni()); // Creamos un cliente falso solo con el DNI

        // El 'Example' buscará coincidencias exactas de los campos no nulos
        if (clienteRepository.exists(Example.of(clienteDni))) {
            throw new IllegalArgumentException("El DNI ya está registrado.");
        }

        //Validar Email (misma lógica)
        Cliente clienteEmail = new Cliente();
        clienteEmail.setEmail(cliente.getEmail());

        if (clienteRepository.exists(Example.of(clienteEmail))) {
            throw new IllegalArgumentException("El Email ya está registrado.");
        }

        //Validar tel
        Cliente clienteTel = new Cliente();
        clienteTel.setTelefono(cliente.getTelefono());
        if (clienteRepository.exists(Example.of(clienteTel))) {
            throw new IllegalArgumentException("El Teléfono ya está registrado");
        }

        return clienteRepository.save(cliente);
    }

    //elimina cliente por id
    @Override
    public void deleteCliente(Long id) {
        Cliente clienteExistente = findCliente(id);
        if (clienteExistente == null) {
            throw new IllegalArgumentException("El cliente con id " + id + " no existe.");
        }
        clienteRepository.deleteById(id);
    }

    //busca cliente por id
    @Override
    public Cliente findCliente(Long id) {
        Optional<Cliente> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            return cliente.get();
        }
        throw new IllegalArgumentException("El cliente con id " + id + " no existe");
    }

    //permite editar los datos de un cliente siempre que se cumpla con las validaciones
    //para evitar valores repetidos
    @Override
    public Cliente editCliente(Cliente cliente) {
        // Verificar si el cliente a editar existe
        Cliente clienteExistente = findCliente(cliente.getId());
        if (clienteExistente == null) {
            throw new IllegalArgumentException("El cliente con id " + cliente.getId() + " no existe.");
        }

        // --- Validaciones de Unicidad ---

        // Validar DNI
        Optional<Cliente> clienteConMismoDni = clienteRepository.findByDni(cliente.getDni());

        // Verificamos si existe un cliente con ese DNI Y si su ID es diferente al
        // cliente que estamos editando
        if (clienteConMismoDni.isPresent() && !clienteConMismoDni.get().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException("El DNI ya está registrado por otro cliente.");
        }

        //Validar Email
        Optional<Cliente> clienteConMismoEmail = clienteRepository.findByEmail(cliente.getEmail());
        if (clienteConMismoEmail.isPresent() && !clienteConMismoEmail.get().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException("El Email ya está registrado por otro cliente.");
        }

        //Validar Teléfono
        Optional<Cliente> clienteConMismoTelefono = clienteRepository.findByTelefono(cliente.getTelefono());
        if (clienteConMismoTelefono.isPresent() && !clienteConMismoTelefono.get().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException("El Telefono ya está registrado por otro cliente.");
        }

        // --- Actualización de Datos y Guardado ---
        // Si las validaciones pasan, actualizamos los campos del objeto existente
        clienteExistente.setNombre(cliente.getNombre());
        clienteExistente.setApellido(cliente.getApellido());
        clienteExistente.setDni(cliente.getDni());
        clienteExistente.setTelefono(cliente.getTelefono());
        clienteExistente.setEmail(cliente.getEmail());

        // Guardamos la entidad actualizada
        return clienteRepository.save(clienteExistente);
    }

    //búsqueda por caracteres del nombre del cliente
    @Override
    public List<Cliente> findByNombreContainingIgnoreCase(String nombre) {
        List<Cliente> clientes = clienteRepository.findByNombreContainingIgnoreCase(nombre);
        if (clientes.isEmpty()) {
            throw new IllegalArgumentException("No se encontraron clientes con nombre que contenga: " + nombre);
        }
        return clientes;
    }

    //búsqueda por dni
    @Override
    public Optional<Cliente> findByDni(String dni) {
        Optional<Cliente> cliente = clienteRepository.findByDni(dni);
        if (cliente.isPresent()) {
            return cliente;
        }
        throw new IllegalArgumentException("El cliente con dni " + dni + " no existe");
    }
}
