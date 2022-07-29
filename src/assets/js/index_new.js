import "../style/index.scss";
import "../style/common.scss";

import { defineCustomElements } from "@esri/calcite-components/dist/loader";

defineCustomElements(window, {
    resourcesUrl: "https://js.arcgis.com/calcite-components/1.0.0-beta.77/assets"
});

import config from './config.json';
import * as Mobile from './utils/mobile';
import * as UIManager from '../js/utils/UIManager';

import basemap_2d_img from "../img/Asset_Basemap_2D.jpg";
import basemap_3d_img from "../img/Asset_Basemap_3D.jpg";
import asset_content_change from "../img/Asset_Content_Change.jpg";
import asset_content_emu from "../img/Asset_Content_EMU.jpg";

import * as d3 from "d3";
import PubSub from "pubsub-js";

const menuContainerBackgroundEle = document.querySelector(".menu-container-background");
const menuContainerEle = document.querySelector(".menu-container");
const menuCompactedEle = document.querySelector(".menu-compacted");
const menuExpandedEle = document.querySelector(".menu-expanded");

menuContainerEle.addEventListener("click", event => {
    console.debug(event.target);
    if (UIManager.hasClass(menuContainerEle, "selected")) {
        UIManager.removeClass(menuContainerEle, "selected");
        menuContainerBackgroundEle.style.height = 2.5+"rem";
        menuCompactedEle.style.height = "unset";
        UIManager.addClass(menuExpandedEle, "hide");
    } else {
        UIManager.addClass(menuContainerEle, "selected");
        menuContainerBackgroundEle.style.height = 400 + "px";
        menuCompactedEle.style.height = 400 + "px";
        UIManager.removeClass(menuExpandedEle, "hide");
    }
});

setTimeout(() => {
    const appLoaderEle = document.querySelector(".app-loader");
    UIManager.addClass(appLoaderEle, "m-fadeOut");
    }, 2000);

// Check if client is on a mobile device
const isMobile = Mobile.isMobileBrowser();

if (isMobile) {

}











// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
