package com.aloha._24eum.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha._24eum.dto.DesignModel;
import com.aloha._24eum.service.DesignService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/designs")
@RequiredArgsConstructor
public class DesignController {

    private final DesignService designService;

    @GetMapping
    public List<DesignModel> list() { return designService.list(); }

    @GetMapping("/{id}")
    public DesignModel get(@PathVariable Long id) { return designService.get(id); }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DesignModel create(@RequestBody DesignModel design) { return designService.create(design); }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DesignModel update(@PathVariable Long id, @RequestBody DesignModel design) {
        design.setId(id);
        return designService.update(design);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        designService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
