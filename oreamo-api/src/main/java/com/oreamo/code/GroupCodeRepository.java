package com.oreamo.code;

import java.util.Optional;

import com.oreamo.code.model.GroupCode;
import com.oreamo.code.model.GroupCodeDelete;
import com.oreamo.code.model.GroupCodeSave;
import com.oreamo.code.model.GroupCodeSearch;
import com.oreamo.code.model.GroupCodeUpdate;
import com.oreamo.code.model.GroupCodesSearch;
import com.github.pagehelper.Page;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GroupCodeRepository {

    Page<GroupCode> selectGroupCodes(GroupCodesSearch groupCodesSearch);

    Optional<GroupCode> selectGroupCode(GroupCodeSearch groupCodeSearch);

    int insertGroupCode(GroupCodeSave groupCodeSave);

    int updateGroupCode(GroupCodeUpdate groupCodeUpdate);

    int updateCommonCodesByGroupCodeUpdate(GroupCodeUpdate groupCodeUpdate);

    int deleteGroupCode(GroupCodeDelete groupCodeDelete);

    int deleteCommonCodesByGroupCodeDelete(GroupCodeDelete groupCodeDelete);
}
