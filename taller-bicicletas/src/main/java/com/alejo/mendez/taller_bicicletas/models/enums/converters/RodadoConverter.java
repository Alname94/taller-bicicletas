package com.alejo.mendez.taller_bicicletas.models.enums.converters;

import com.alejo.mendez.taller_bicicletas.models.enums.Rodado;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

//utilizo un converter para mapear el enum Rodado a la base de datos y viceversa
//de esta forma, en la BD se guarda el valor asociado (String) y en la aplicación se utiliza el enum Rodado
@Converter(autoApply = true)
public class RodadoConverter implements AttributeConverter<Rodado, String> {

    @Override
    public String convertToDatabaseColumn(Rodado attribute) {
        return attribute.getValorAsociado();
    }

    @Override
    public Rodado convertToEntityAttribute(String dbData) {
        return Rodado.compararValorAsociado(dbData);
    }
}