package com.revivio.exception;

public class InvalidWorkflowTransitionException extends RuntimeException {

    private final String from;
    private final String to;

    public InvalidWorkflowTransitionException(String from, String to) {
        super(String.format("Invalid workflow transition from '%s' to '%s'", from, to));
        this.from = from;
        this.to = to;
    }

    public String getFrom() {
        return from;
    }

    public String getTo() {
        return to;
    }
}
