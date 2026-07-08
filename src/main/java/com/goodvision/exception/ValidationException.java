package com.goodvision.exception;

import java.util.Map;

public class ValidationException extends RuntimeException {

    private Map<String, String> errors;

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(Map<String, String> errors) {
        super("Errores de validación");
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }
}
