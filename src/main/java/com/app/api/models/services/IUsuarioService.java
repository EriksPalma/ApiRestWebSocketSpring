package com.app.api.models.services;

import java.util.List;

import com.app.api.models.entity.Usuario;

public interface IUsuarioService {
	
	public List<Usuario> findAll();
	public Usuario findById(Long id);
	public Usuario save(Usuario usuario );
	public void delete(Long id);
	

}
