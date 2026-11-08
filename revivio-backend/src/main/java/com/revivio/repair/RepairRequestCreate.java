package com.revivio.repair;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RepairRequestCreate(
        @NotNull(message = "Registered product ID is required")
        Long customerProductId,

        @NotNull(message = "Issue category is required")
        IssueCategory issueCategory,

        @NotBlank(message = "Issue title is required")
        String issueTitle,

        @NotBlank(message = "Detailed problem description is required")
        @Size(min = 20, message = "Problem description must be at least 20 characters")
        String issueDescription,

        @NotNull(message = "Priority is required")
        Priority priority,

        String additionalComments
) {}
