package com.revivio.repair;

import jakarta.validation.constraints.NotBlank;

public record DiagnosisRequest(
        @NotBlank(message = "Diagnostic assessment cannot be blank")
        String diagnosisNotes
) {}
