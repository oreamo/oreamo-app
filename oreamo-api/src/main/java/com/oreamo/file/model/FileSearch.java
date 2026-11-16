package com.oreamo.file.model;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileSearch {

    @Schema(description = "File Group ID")
    private String fileGroupId;

    @Schema(description = "File ID")
    private String fileId;

    public static FileSearch ofFileId(String fileGroupId, String fileId) {
        return FileSearch.builder().fileGroupId(fileGroupId).fileId(fileId).build();
    }
}
