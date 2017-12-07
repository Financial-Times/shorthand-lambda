'use strict';

module.exports = (navItems) => {
  let navHtml = `
  <div class="o-header__drawer" id="o-header-drawer" data-o-header-drawer="" data-o-header-drawer--no-js="">
    <div class="o-header__drawer-inner">

    <div class="o-header__drawer-tools">
        <a class="o-header__drawer-tools-logo" href="https://www.ft.com/">
            <span class="o-header__visually-hidden">Financial Times</span>
        </a>
        <button type="button" class="o-header__drawer-tools-close" aria-controls="o-header-drawer">
            <span class="o-header__visually-hidden">Close</span>
        </button>
    </div>

    <nav class="o-header__drawer-menu o-header__drawer-menu--primary" role="navigation" aria-label="Primary navigation">

        <ul class="o-header__drawer-menu-list">`;
  navItems.forEach(navItem => {
    navHtml += `<li class="o-header__drawer-menu-item ">
                <a class="o-header__drawer-menu-link" href="https://next.ft.com${navItem.item.href}">${navItem.item.name}</a>
            </li>`;
  });

  navHtml += `</ul></nav></div></div>`;

  return navHtml;
};