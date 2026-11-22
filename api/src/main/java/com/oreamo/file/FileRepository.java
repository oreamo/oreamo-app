package com.oreamo.file;

import java.util.List;
import java.util.Optional;

import com.oreamo.file.model.FileDelete;
import com.oreamo.file.model.FileInfo;
import com.oreamo.file.model.FileSearch;
import com.oreamo.file.model.FileStorageUpload;
import com.oreamo.file.model.FileUpload;
import com.oreamo.file.model.FilesSearch;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface FileRepository {

    List<FileInfo> selectFiles(FilesSearch filesSearch);

    Optional<FileInfo> selectFile(FileSearch fileSearch);

    int insertFiles(List<FileStorageUpload> fileStorageUploads);

    int deleteFiles(FileUpload fileUpload);

    int deleteFile(FileDelete fileDelete);
}
