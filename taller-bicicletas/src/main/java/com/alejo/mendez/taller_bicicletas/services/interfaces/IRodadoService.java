package com.alejo.mendez.taller_bicicletas.services.interfaces;

import java.util.List;

public interface IRodadoService {

    /**
     * Obtiene la lista de los valores asociados a cada rodado.
     * @return Una lista de Strings con los valores de los rodados.
     */
    List<String> obtenerValoresRodado();
}
