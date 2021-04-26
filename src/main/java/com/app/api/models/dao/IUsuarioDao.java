package com.app.api.models.dao;

import org.springframework.data.repository.CrudRepository;

import com.app.api.models.entity.Usuario;

public interface IUsuarioDao extends CrudRepository<Usuario, Long> {

}