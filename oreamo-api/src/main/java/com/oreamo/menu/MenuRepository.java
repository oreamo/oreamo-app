package com.oreamo.menu;

import java.util.List;
import java.util.Optional;

import com.oreamo.menu.model.Menu;
import com.oreamo.menu.model.MenuDelete;
import com.oreamo.menu.model.MenuSave;
import com.oreamo.menu.model.MenuSearch;
import com.oreamo.menu.model.MenuTreeNode;
import com.oreamo.menu.model.MenuUpdate;
import com.oreamo.menu.model.MenusSearch;
import com.github.pagehelper.Page;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MenuRepository {

    Page<Menu> selectMenus(MenusSearch menusSearch);

    Optional<Menu> selectMenu(MenuSearch menuSearch);

    List<MenuTreeNode> selectMenuTreeNodes(List<String> permissionCodes);

    int insertMenu(MenuSave menuSave);

    int updateMenu(MenuUpdate menuUpdate);

    int deleteMenu(MenuDelete menuDelete);
}
