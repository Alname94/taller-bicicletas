package com.alejo.mendez.taller_bicicletas.services;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.alejo.mendez.taller_bicicletas.models.enums.Rodado;
import com.alejo.mendez.taller_bicicletas.services.interfaces.IRodadoService;

@Service
public class RodadoService implements IRodadoService {

    @Override
    public List<String> obtenerValoresRodado() {
        return Arrays.stream(Rodado.values())
                     .map(Rodado::getValorAsociado)
                     .collect(Collectors.toList());
    }

}