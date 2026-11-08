package com.revivio.repair;

import java.time.Instant;

public record RepairHistoryResponse(
        Long id,
        RepairStatus previousStatus,
        RepairStatus newStatus,
        Long actorId,
        String actorName,
        String comment,
        Instant createdAt
) {
    public static RepairHistoryResponse from(RepairHistory rh) {
        return new RepairHistoryResponse(
                rh.getId(),
                rh.getPreviousStatus(),
                rh.getNewStatus(),
                rh.getActorId(),
                rh.getActorName(),
                rh.getComment(),
                rh.getCreatedAt()
        );
    }
}
