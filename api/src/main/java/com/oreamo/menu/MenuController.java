package com.oreamo.menu;

import java.util.List;

import jakarta.validation.Valid;

import com.github.pagehelper.Page;
import com.oreamo.authority.model.PermissionCode;
import com.oreamo.common.dto.PageResponse;
import com.oreamo.common.dto.RestResponse;
import com.oreamo.core.security.Authorize;
import com.oreamo.menu.model.*;
import com.oreamo.user.model.SessionUser;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@Tag(name = "Menu", description = "Menu API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/menus")
public class MenuController {

    private final MenuService menuService;

    @Operation(summary = "Get Menus")
    @GetMapping
    @Authorize(menuId = MenuId.MENU_MANAGEMENT, permissionCode = PermissionCode.READ)
    public RestResponse<PageResponse<Menu>> getMenus(@Valid @ModelAttribute MenusSearch menusSearch) {
        Page<Menu> pagedMenus = menuService.getMenus(menusSearch);
        return RestResponse.ofSuccess(PageResponse.ofPage(pagedMenus));
    }

    @Operation(summary = "Get Menu")
    @GetMapping("/{menuId}")
    @Authorize(menuId = MenuId.MENU_MANAGEMENT, permissionCode = PermissionCode.READ)
    public RestResponse<Menu> getMenu(@ModelAttribute MenuSearch menuSearch) {
        Menu foundMenu = menuService.getMenu(menuSearch);
        return RestResponse.ofSuccess(foundMenu);
    }

    @Operation(summary = "Get Menu Tree")
    @GetMapping("/tree")
    public RestResponse<List<MenuTreeNode>> getMenuTree(@AuthenticationPrincipal SessionUser sessionUser) {
        return RestResponse.ofSuccess(menuService.getMenuTree(sessionUser.getRoleCode()));
    }

    @Operation(summary = "Post Menu")
    @PostMapping
    @Authorize(menuId = MenuId.MENU_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<Menu> postMenu(@Valid @RequestBody MenuSave menuSave) {
        Menu createdMenu = menuService.saveMenu(menuSave);
        return RestResponse.ofSuccess(createdMenu);
    }

    @Operation(summary = "Put Menu")
    @PutMapping("/{menuId}")
    @Authorize(menuId = MenuId.MENU_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<Void> putMenu(@Valid @RequestBody MenuUpdate menuUpdate) {
        menuService.updateMenu(menuUpdate);
        return RestResponse.ofSuccess(null);
    }

    @Operation(summary = "Delete Menu")
    @DeleteMapping("/{menuId}")
    @Authorize(menuId = MenuId.MENU_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<Boolean> deleteMenu(@Valid @RequestBody MenuDelete menuDelete) {
        menuService.deleteMenu(menuDelete);
        return RestResponse.ofSuccess(true);
    }

    @Operation(summary = "Operate Menus")
    @PostMapping("/operation")
    @Authorize(menuId = MenuId.MENU_MANAGEMENT, permissionCode = PermissionCode.WRITE)
    public RestResponse<Boolean> operationMenus(@Valid @RequestBody MenuOperate menuOperate) {
        menuService.operateMenus(menuOperate);
        return RestResponse.ofSuccess(true);
    }
}
