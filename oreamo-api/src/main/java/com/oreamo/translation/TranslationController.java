package com.oreamo.translation;

import java.util.List;

import jakarta.validation.Valid;

import com.oreamo.authority.model.PermissionCode;
import com.oreamo.common.dto.PageResponse;
import com.oreamo.common.dto.RestResponse;
import com.oreamo.core.security.Authorize;
import com.oreamo.translation.model.Translation;
import com.oreamo.translation.model.TranslationDelete;
import com.oreamo.translation.model.TranslationInfo;
import com.oreamo.translation.model.TranslationOperation;
import com.oreamo.translation.model.TranslationSave;
import com.oreamo.translation.model.TranslationSearch;
import com.oreamo.translation.model.TranslationUpdate;
import com.github.pagehelper.Page;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@Tag(name = "Translation", description = "Translation API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/translations")
public class TranslationController {

    private final TranslationService translationService;

    @Operation(summary = "Get Translations")
    @GetMapping
    @Authorize(permissionCodes = PermissionCode.TRANSLATION_MANAGEMENT_READ)
    public RestResponse<PageResponse<Translation>> getTranslations(
            @ModelAttribute TranslationSearch translationSearch) {
        Page<Translation> translations = translationService.getTranslations(translationSearch);
        return RestResponse.ofSuccess(PageResponse.ofPage(translations));
    }

    @Operation(summary = "Get Translation Information")
    @GetMapping("/infos")
    public RestResponse<List<TranslationInfo>> getTranslationInfos() {
        List<TranslationInfo> translationInfos = translationService.getTranslationInfos();
        return RestResponse.ofSuccess(translationInfos);
    }

    @Operation(summary = "Post Translation")
    @PostMapping
    @Authorize(permissionCodes = PermissionCode.TRANSLATION_MANAGEMENT_WRITE)
    public RestResponse<Translation> postTranslation(@Valid @RequestBody TranslationSave translationSave) {
        Translation createdTranslation = translationService.saveTranslation(translationSave);
        return RestResponse.ofSuccess(createdTranslation);
    }

    @Operation(summary = "Put Translation")
    @PutMapping("/{translationCode}")
    @Authorize(permissionCodes = PermissionCode.TRANSLATION_MANAGEMENT_WRITE)
    public RestResponse<Translation> putTranslation(@Valid @RequestBody TranslationUpdate translationUpdate) {
        Translation updatedTranslation = translationService.updateTranslation(translationUpdate);
        return RestResponse.ofSuccess(updatedTranslation);
    }

    @Operation(summary = "Delete Translation")
    @DeleteMapping("/{translationCode}")
    @Authorize(permissionCodes = PermissionCode.TRANSLATION_MANAGEMENT_WRITE)
    public RestResponse<Boolean> deleteTranslation(@Valid @RequestBody TranslationDelete translationDelete) {
        translationService.deleteTranslation(translationDelete);
        return RestResponse.ofSuccess(true);
    }

    @Operation(summary = "Operate Translations")
    @PostMapping("/operation")
    @Authorize(permissionCodes = PermissionCode.TRANSLATION_MANAGEMENT_WRITE)
    public RestResponse<Boolean> operationTranslations(@Valid @RequestBody TranslationOperation translationOperation) {
        translationService.operateTranslations(translationOperation);
        return RestResponse.ofSuccess(true);
    }
}
