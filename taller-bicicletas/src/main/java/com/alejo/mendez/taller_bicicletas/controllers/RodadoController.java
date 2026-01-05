package com.alejo.mendez.taller_bicicletas.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alejo.mendez.taller_bicicletas.services.interfaces.IRodadoService;

@RestController
@RequestMapping("html/rodados")
public class RodadoController {

    @Autowired
    private IRodadoService rodadoService;

    @GetMapping
    public List<String> obtenerRodados() {
        return rodadoService.obtenerValoresRodado();
    }
}
