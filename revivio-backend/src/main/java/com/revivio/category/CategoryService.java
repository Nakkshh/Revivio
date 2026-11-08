package com.revivio.category;

import com.revivio.exception.DuplicateResourceException;
import com.revivio.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllActiveCategories() {
        return categoryRepository.findByActiveTrue()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return CategoryResponse.from(category);
    }

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new DuplicateResourceException("Category " + request.name() + " already exists.");
        }
        Category category = Category.builder()
                .name(request.name().trim())
                .description(request.description())
                .iconName(request.iconName())
                .active(true)
                .build();
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        category.setName(request.name().trim());
        category.setDescription(request.description());
        category.setIconName(request.iconName());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        category.setActive(false);
        categoryRepository.save(category);
    }
}
