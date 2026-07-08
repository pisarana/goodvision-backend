package com.goodvision.service.impl;

import com.goodvision.entity.Categoria;
import com.goodvision.exception.ResourceNotFoundException;
import com.goodvision.repository.CategoriaRepository;
import com.goodvision.service.CategoriaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public List<Categoria> findAll() {
        return categoriaRepository.findAll();
    }

    @Override
    public Categoria findById(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", "id", id));
    }

    @Override
    @Transactional
    public Categoria save(Categoria categoria) {
        categoria.setIdCategoria(null);
        return categoriaRepository.save(categoria);
    }

    @Override
    @Transactional
    public Categoria update(Long id, Categoria categoria) {
        Categoria existingCategoria = findById(id);
        existingCategoria.setNombreCategoria(categoria.getNombreCategoria());
        return categoriaRepository.save(existingCategoria);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Categoria categoria = findById(id);
        try {
            categoriaRepository.delete(categoria);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new com.goodvision.exception.BusinessRuleViolationException(
                "No se puede eliminar la categoría porque tiene productos asociados"
            );
        }
    }

    @Override
    public List<Categoria> findByNombre(String nombre) {
        return categoriaRepository.findByNombreCategoriaContainingIgnoreCase(nombre);
    }
}
