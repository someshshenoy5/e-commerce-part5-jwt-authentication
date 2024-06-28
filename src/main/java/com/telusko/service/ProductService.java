package com.telusko.service;

import com.telusko.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();
    Product getProductById(Integer id);
    Product createProduct(Product product, MultipartFile imageFile) throws Exception;
    Product updateProduct(Integer id, Product product, MultipartFile imageFile) throws Exception;
    void deleteProduct(Integer id);
    List<Product> searchProducts(String keyword);
}
