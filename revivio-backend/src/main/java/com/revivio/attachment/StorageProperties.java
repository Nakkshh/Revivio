package com.revivio.attachment;

import com.revivio.exception.StorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StorageProperties {

    private final String location;

    public StorageProperties(@Value("${app.storage.location:./uploads}") String location) {
        this.location = location;
    }

    public String getLocation() {
        return location;
    }
}
