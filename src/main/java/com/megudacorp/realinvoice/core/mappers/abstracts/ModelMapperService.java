package com.megudacorp.realinvoice.core.mappers.abstracts;

import org.modelmapper.ModelMapper;

public interface ModelMapperService {
    ModelMapper forResponse();
    ModelMapper forRequest();
}
