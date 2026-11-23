package com.oreamo.menu.model;

import com.oreamo.common.model.DataRecord;

import org.springframework.util.StringUtils;

import io.swagger.v3.oas.annotations.media.Schema;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Menu extends DataRecord {

    @Schema(description = "Menu ID")
    private String menuId;

    @Schema(description = "Menu Name")
    private String menuName;

    @Schema(description = "Menu Type")
    private String menuType;

    @Schema(description = "URL")
    private String url;

    @Schema(description = "Parent Menu ID")
    private String parentMenuId;

    @Schema(description = "Sort Order")
    private Integer sortOrder;

    public boolean hasParentMenu() {
        return StringUtils.hasText(parentMenuId);
    }
}
