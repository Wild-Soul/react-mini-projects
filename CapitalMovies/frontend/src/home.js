import React from 'react';
import { Buttons } from './Buttons';
import { Movies } from './movies';
import { Tabs } from './tabs';
export const Home = () => {
    return <>
        <Tabs />
        <hr className="seperator"/>
        <Movies />
        <Buttons />
    </>
}