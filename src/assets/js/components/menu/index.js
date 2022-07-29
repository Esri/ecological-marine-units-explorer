import "./index.scss";

import PubSub from "pubsub-js";
import * as UIManager from "../../utils/UIManager";
import * as ShareModal from "../shareModal";
import config from "../../config.json";
import basemap_2d_img from "../../../img/Asset_Basemap_2D.jpg";
import basemap_3d_img from "../../../img/Asset_Basemap_3D.jpg";
import asset_content_emu from "../../../img/Asset_Content_EMU.jpg";
import asset_content_change from "../../../img/Asset_Content_Change.jpg";

const appOverlayEle = document.getElementById("app-overlay");
const menuComponentEle = document.querySelector(".menu-component-container");
const basemapMenuItems = document.querySelectorAll(".basemap-item");
const contentMenuItems = document.querySelectorAll(".content-item");

setImageSrc(".basemap_2d", basemap_2d_img);
setImageSrc(".basemap_3d", basemap_3d_img);
setImageSrc(".current-emu-img", asset_content_emu);
setImageSrc(".emu-change-img", asset_content_change);

export function initMenu(viewType, contentType) {

    let itemSelectedPropId = "item-selected";
    let contentSelectedPropId = "content-item-selected";

    UIManager.removeClass(menuComponentEle, "hide");
    appOverlayEle.addEventListener("click", menuClickHandler);
    menuComponentEle.addEventListener("click", menuClickHandler);

    basemapMenuItems.forEach(contentMenuItem => {
        contentMenuItem.addEventListener("click", (event) => {
            UIManager.removeSelected(basemapMenuItems, itemSelectedPropId);
            UIManager.addClass(contentMenuItem, itemSelectedPropId);
            PubSub.publish("View Type Updated", "");
        });
    });

    contentMenuItems.forEach(contentMenuItem => {
        contentMenuItem.addEventListener("click", (event) => {
            UIManager.removeSelected(contentMenuItems, contentSelectedPropId);
            UIManager.addClass(contentMenuItem, contentSelectedPropId);
            PubSub.publish("View Source Updated", "");
        });
    });

    hydrateMenuLegend();

    const viewTypeEle = document.querySelector(`[data-view-type='${viewType}']`);
    UIManager.addClass(viewTypeEle, itemSelectedPropId);

    const contentTypeEle = document.querySelector(`[data-content-type='${contentType}']`);
    UIManager.addClass(contentTypeEle, contentSelectedPropId);
}

function menuClickHandler(event) {
    if (UIManager.hasClass(event.target, "share-icon")) {
        let shareModalEle = document.querySelector(".share-modal");
        shareModalEle.setAttribute("active", "");
        ShareModal.createBitly();
    } else {
        let expandedMenuEle = document.querySelector(".menu-expanded");
        let menuComponentEle = document.querySelector(".menu-component");
        if (UIManager.hasClass(expandedMenuEle, "hide")) {
            menuComponentEle.style.height = "100%";
            UIManager.removeClass(expandedMenuEle, "hide");
        } else {
            menuComponentEle.style.height = "2.5rem";
            UIManager.addClass(expandedMenuEle, "hide");
        }

        UIManager.hasClass(expandedMenuEle, "hide") ? appOverlayEle.style.display = "none" : appOverlayEle.style.display = "flex";
    }
}

function hydrateMenuLegend() {
    let menuEmuDescriptionsSectionEle = document.getElementById("menuLegend");
    config.CLUSTERS.forEach(cluster => {
        let row = document.createElement("div");
        row.setAttribute("class", "menu-legend-row");
        row.innerHTML = `
                <div class="menu-key-container" style="background: ${cluster["fill"]};">
                    <div class="menu-key-value">${parseInt(cluster["id"])}</div>
                </div>

                <div class="menu-description-container">
                    <div class="menu-description-value">${cluster["EMU_Name"]}</div>
                </div>`;
        menuEmuDescriptionsSectionEle.appendChild(row);
    });
}

function setImageSrc(selector, imgSrc) {
    let ele = document.querySelector(selector);
    ele.setAttribute("src", imgSrc);
}
