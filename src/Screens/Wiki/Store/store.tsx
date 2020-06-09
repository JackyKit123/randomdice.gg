import React from 'react';
import Main from '../../../Components/Main/main';
import './store.less';

export default function Store(): JSX.Element {
    return (
        <Main title='Store Guide' className='wiki store'>
            <p>
                You can find the store on the Bottom Left corner on the Main
                Screen.
            </p>
            <p>
                The shop resets daily or every 6 by watching advertisement. Each
                reset refreshes the special bundle and the 6 items.
            </p>
            <ul>
                <li> First Item can be Free Gold, Free Box or Free Gems.</li>
                <li>
                    From Second Item to Fifth Item will contain a Dice
                    (Non-Legendary Dices only) that will have its cost based on
                    Dice Rarity and Quantity. Rarely, you may find a Special
                    Box, like Rare Box or Unique Box.
                </li>
                <li>
                    Sixth Item will be a Rare Item which can be a Legendary Dice
                    (40.000 Gold Cost), a Legendary Box (500 Gems Cost), another
                    Dice or Other Special Items.
                </li>
            </ul>
            <p>On the Store you can also find:</p>
            <ul>
                <li> Special Bundles.</li>
                <li>
                    Gold Box, Platinum Box, Diamond Box, King&apos;s Legacy.
                </li>
                <li>Gems Bundles.</li>
                <li>Premium Alliance Mode (adds 5 extra alliance Tickets).</li>
                <li>Royal Premium Pass (Extra Trophy Rewards).</li>
                <li>Premium Emoticon (5 Extra Emoticons-500 Gems Cost).</li>
                <li>Gold.</li>
                <li>Restore Purchased Item Button.</li>
            </ul>
        </Main>
    );
}
