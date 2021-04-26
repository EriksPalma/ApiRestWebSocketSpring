package com.app.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.app.api.models.entity.Usuario;
import com.app.api.models.services.IUsuarioService;

@CrossOrigin(origins = {"http://localhost:4200"})
@RestController
@RequestMapping("/api")
public class UsuarioRestController {
	
	@Autowired
	private IUsuarioService usuarioService;
	
	@GetMapping("/usuarios")
	public List<Usuario> index(){
		
		return usuarioService.findAll();
	}

	@GetMapping("/usuarios/{id}")
	public Usuario getById(@PathVariable Long id) {
		
		return usuarioService.findById(id);
	}
	
	@PostMapping("/usuarios")
	@ResponseStatus(HttpStatus.CREATED)
	public Usuario create(@RequestBody Usuario usuario) {
		
		return usuarioService.save(usuario);
	}
	
	@PutMapping("/usuarios/{id}")
	@ResponseStatus(HttpStatus.CREATED)
	public Usuario update(@RequestBody Usuario usuario,@PathVariable Long id) {
		
		Usuario usuarioActual = usuarioService.findById(id);
		
		usuarioActual.setFirstName(usuario.getFirstName());
		usuarioActual.setLastName(usuario.getLastName());
		usuarioActual.setEmail(usuario.getEmail());
		if(usuario.getPassword() != null) {
			usuarioActual.setPassword(usuario.getPassword());
		}		

		return usuarioService.save(usuarioActual);
	}
	
	@DeleteMapping("/usuarios/{id}")
	@ResponseStatus(HttpStatus.OK)
	public Usuario delete(@PathVariable Long id) {
		Usuario usuario = usuarioService.findById(id); 
		
		usuarioService.delete(id);
		
		return usuario;
	}
}

