package com.oreamo.translation;

import java.util.Optional;

import com.github.pagehelper.Page;
import com.oreamo.translation.model.Translation;
import com.oreamo.translation.model.TranslationDelete;
import com.oreamo.translation.model.TranslationSave;
import com.oreamo.translation.model.TranslationSearch;
import com.oreamo.translation.model.TranslationUpdate;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TranslationRepository {

    Page<Translation> selectTranslations(TranslationSearch translationSearch);

    Optional<Translation> selectTranslation(TranslationSearch translationSearch);

    int insertTranslation(TranslationSave translationSave);

    int updateTranslation(TranslationUpdate translationUpdate);

    int deleteTranslation(TranslationDelete translationDelete);
}
