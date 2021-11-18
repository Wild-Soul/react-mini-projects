import React from "react";
import { useGlobalContext } from "./context";
import {
    DISCOVER,
    LATEST,
    TRENDING,
    FAVOURITES
} from './constants';

export const Tabs = () => {
    const { handleTabChange, tab: currentTab } = useGlobalContext();
    const tabsAvailable = [DISCOVER, LATEST, TRENDING, FAVOURITES];
    // push Favourites in tabsAvailable only when use is signed in.
    return <section className="tabs-container">
        {tabsAvailable.map((tab, index) => {
            return <div key={index} className="tab" onClick={(event) => handleTabChange(event.target.dataset.tab)}>
                <button className={`tab-button ${currentTab===tab ? 'active': ''}`} data-tab={tab}>{tab}</button>
            </div>
        })}
    </section>
}