package com.oreamo.code;

import java.util.Optional;

import com.github.pagehelper.Page;
import com.oreamo.code.model.CommonCode;
import com.oreamo.code.model.CommonCodeDelete;
import com.oreamo.code.model.CommonCodeOperation;
import com.oreamo.code.model.CommonCodeSave;
import com.oreamo.code.model.CommonCodeSearch;
import com.oreamo.code.model.CommonCodeUpdate;
import com.oreamo.code.model.CommonCodesSearch;
import com.oreamo.code.model.GroupCode;
import com.oreamo.code.model.GroupCodeSearch;
import com.oreamo.common.constant.TranslationKey;
import com.oreamo.common.exception.RestException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
class CommonCodeService {

    private final CommonCodeRepository commonCodeRepository;

    private final GroupCodeRepository groupCodeRepository;

    @Transactional(readOnly = true)
    public Page<CommonCode> getCommonCodes(CommonCodesSearch commonCodesSearch) {
        commonCodesSearch.validatePageable();
        return commonCodeRepository.selectCommonCodes(commonCodesSearch);
    }

    @Transactional(readOnly = true)
    public CommonCode getCommonCode(CommonCodeSearch commonCodeSearch) {
        return commonCodeRepository
                .selectCommonCode(commonCodeSearch)
                .orElseThrow(() -> new RestException(
                        TranslationKey.Common.Message.NOT_FOUND_FAILURE, TranslationKey.Code.Label.COMMON_CODE));
    }

    @Transactional
    public CommonCode saveCommonCode(CommonCodeSave commonCodeSave) {
        CommonCodeSearch searchForExistingCommonCode =
                CommonCodeSearch.ofCode(commonCodeSave.getGroupCode(), commonCodeSave.getCommonCode());
        Optional<CommonCode> optionalExistingCommonCode =
                commonCodeRepository.selectCommonCode(searchForExistingCommonCode);
        if (optionalExistingCommonCode.isPresent()) {
            throw new RestException(
                    TranslationKey.Common.Message.DUPLICATE_FAILURE,
                    TranslationKey.Code.Label.COMMON_CODE,
                    commonCodeSave.getCommonCode());
        }

        if (commonCodeSave.isEnabled()) {
            validateGroupCodeEnabled(commonCodeSave.getGroupCode());
        }

        int createdCount = commonCodeRepository.insertCommonCode(commonCodeSave);
        if (createdCount == 0) {
            throw new RestException(TranslationKey.Common.Message.CREATE_FAILURE);
        }

        CommonCodeSearch commonCodeSearch =
                CommonCodeSearch.ofCode(commonCodeSave.getGroupCode(), commonCodeSave.getCommonCode());
        Optional<CommonCode> foundCommonCode = commonCodeRepository.selectCommonCode(commonCodeSearch);

        return foundCommonCode.orElseThrow(() -> new RestException(TranslationKey.Common.Message.CREATE_FAILURE));
    }

    @Transactional
    public CommonCode updateCommonCode(CommonCodeUpdate commonCodeUpdate) {
        CommonCodeSearch commonCodeSearch =
                CommonCodeSearch.ofCode(commonCodeUpdate.getGroupCode(), commonCodeUpdate.getCommonCode());
        commonCodeRepository
                .selectCommonCode(commonCodeSearch)
                .orElseThrow(() -> new RestException(
                        TranslationKey.Common.Message.NOT_FOUND_FAILURE, TranslationKey.Code.Label.COMMON_CODE));

        if (commonCodeUpdate.isEnabled()) {
            validateGroupCodeEnabled(commonCodeUpdate.getGroupCode());
        }

        int updatedCount = commonCodeRepository.updateCommonCode(commonCodeUpdate);
        if (updatedCount == 0) {
            throw new RestException(TranslationKey.Common.Message.UPDATE_FAILURE);
        }

        return commonCodeRepository
                .selectCommonCode(commonCodeSearch)
                .orElseThrow(() -> new RestException(TranslationKey.Common.Message.UPDATE_FAILURE));
    }

    @Transactional
    public void deleteCommonCode(CommonCodeDelete commonCodeDelete) {
        CommonCodeSearch commonCodeSearch =
                CommonCodeSearch.ofCode(commonCodeDelete.getGroupCode(), commonCodeDelete.getCommonCode());
        commonCodeRepository
                .selectCommonCode(commonCodeSearch)
                .orElseThrow(() -> new RestException(
                        TranslationKey.Common.Message.NOT_FOUND_FAILURE, TranslationKey.Code.Label.COMMON_CODE));

        int deletedCount = commonCodeRepository.deleteCommonCode(commonCodeDelete);
        if (deletedCount == 0) {
            throw new RestException(TranslationKey.Common.Message.DELETE_FAILURE);
        }
    }

    @Transactional
    public void operateCommonCodes(CommonCodeOperation commonCodeOperation) {
        if (commonCodeOperation.hasDeleteTargets()) {
            commonCodeOperation.getCommonCodeDeletes().forEach(this::deleteCommonCode);
        }

        if (commonCodeOperation.hasUpdateTargets()) {
            commonCodeOperation.getCommonCodeUpdates().forEach(this::updateCommonCode);
        }

        if (commonCodeOperation.hasSaveTargets()) {
            commonCodeOperation.getCommonCodeSaves().forEach(this::saveCommonCode);
        }
    }

    private void validateGroupCodeEnabled(String groupCode) {
        GroupCodeSearch groupCodeSearch = GroupCodeSearch.ofGroupCode(groupCode);
        GroupCode foundGroupCode = groupCodeRepository
                .selectGroupCode(groupCodeSearch)
                .orElseThrow(() -> new RestException(
                        TranslationKey.Common.Message.NOT_FOUND_FAILURE, TranslationKey.Code.Label.GROUP_CODE));

        if (!foundGroupCode.isEnabled()) {
            throw new RestException(TranslationKey.Code.Message.COMMON_CODE_ENABLE_FAILURE_BY_DISABLED_GROUP_CODE);
        }
    }
}
