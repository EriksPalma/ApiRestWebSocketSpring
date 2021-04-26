package com.app.api.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.app.api.models.entity.Usuario;
import com.app.api.models.services.IUsuarioService;

@CrossOrigin(origins = {"http://localhost:4200"})
@Controller
public class WebSocketController {
	
	//private final SimpMessagingTemplate template;

    /*@Autowired
    WebSocketController(SimpMessagingTemplate template){
        this.template = template;
    }*/

	
	@Autowired
	private IUsuarioService usuarioService;


	@MessageMapping("/usuarios")
	@SendTo("/topic")
	//public void greeting(String test  ) throws Exception {
	public List<Usuario> greeting(String test  ) throws Exception {
	
		System.out.println(test);
	//	this.template.convertAndSend("/topic",  "server"+test);
		return usuarioService.findAll() ;
	}

}