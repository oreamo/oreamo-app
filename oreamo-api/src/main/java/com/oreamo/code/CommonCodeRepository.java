package com.oreamo.code;

import java.util.Optional;

import com.oreamo.code.model.CommonCode;
import com.oreamo.code.model.CommonCodeDelete;
import com.oreamo.code.model.CommonCodeSave;
import com.oreamo.code.model.CommonCodeSearch;
import com.oreamo.code.model.CommonCodeUpdate;
import com.oreamo.code.model.CommonCodesSearch;
import com.github.pagehelper.Page;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommonCodeRepository {

    Page<CommonCode> selectCommonCodes(CommonCodesSearch commonCodesSearch);

    Optional<CommonCode> selectCommonCode(CommonCodeSearch commonCodeSearch);

    int insertCommonCode(CommonCodeSave commonCodeSave);

    int updateCommonCode(CommonCodeUpdate commonCodeUpdate);

    int deleteCommonCode(CommonCodeDelete commonCodeDelete);
}
