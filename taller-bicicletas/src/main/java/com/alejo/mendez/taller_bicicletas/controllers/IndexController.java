package com.alejo.mendez.taller_bicicletas.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.alejo.mendez.taller_bicicletas.models.entities.Bicicleta;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IBicicletaService;

//controller para utilizar con la vista thymeleaf
@Controller
public class IndexController {

    @Autowired
    private IBicicletaService bicicletaService;

    //obtiene las bicicletas con fecha de egreso null
    @GetMapping("/")
    public String listarBicicletasEnTaller(Model model) {
        try {
            List<Bicicleta> bicicletas = bicicletaService.findByFechaEgresoIsNull();
            model.addAttribute("bicicletasEnTaller", bicicletas); 
            return "index"; 
            
        } catch (Exception e) {
            model.addAttribute("error", "Error al cargar las bicicletas: " + e.getMessage());
            return "index"; 
        }
    }
}
