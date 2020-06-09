import React from 'react';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import Main from '../../../Components/Main/main';
import PipDpsWebp from './Image/PipDps.webp';
import saveGoldWebp from './Image/saveGold.webp';
import KnightTransformWebp from './Image/KnightTransform.webp';
import sacrificeSpWebp from './Image/sacrificeSp.webp';
import ShopRefreshesWebp from './Image/ShopRefreshes.webp';
import IceVsBlizzardWebp from './Image/IceVsBlizzard.webp';
import summonerMergeWebp from './Image/summonerMerge.webp';
import supportDiceBoardWebp from './Image/supportDiceBoard.webp';
import duplicateSupportDiceWebp from './Image/duplicateSupportDice.webp';
import elementBoardWebp from './Image/elementBoard.webp';
import arenaCheatSheetWebp from './Image/arenaCheatSheet.webp';
import PipDpsPng from './Image/PipDps.png';
import saveGoldPng from './Image/saveGold.png';
import KnightTransformPng from './Image/KnightTransform.png';
import sacrificeSpPng from './Image/sacrificeSp.png';
import ShopRefreshesPng from './Image/ShopRefreshes.png';
import IceVsBlizzardPng from './Image/IceVsBlizzard.png';
import summonerMergePng from './Image/summonerMerge.png';
import supportDiceBoardPng from './Image/supportDiceBoard.png';
import duplicateSupportDicePng from './Image/duplicateSupportDice.png';
import elementBoardPng from './Image/elementBoard.png';
import arenaCheatSheetPng from './Image/arenaCheatSheet.png';
import './guide.less';

export default function Basic(): JSX.Element {
    return (
        <Main title='Basic Guides and Tips' className='wiki guide'>
            <p>
                Here you will find the some tips and trick to guide you off the
                beginning of the game.
            </p>
            <h3>The Basics of Merging and Board setup</h3>
            <p>General principle of Board setup :</p>
            <p>
                There are 15 slots on your Board and you will want to fill these
                as quickly as possible, doing so without Merging costs 1200 SP.
                There are some Dice like Sacrificial that will award a player
                with 80 SP or Summoner which, when merged will produce another
                Dice with a random number of pips. This will hasten doing so.
            </p>
            <ul>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={isWebpSupported() ? PipDpsWebp : PipDpsPng}
                            alt='15 1pip has more value than 1 5pip'
                        />
                    </div>
                    <span>
                        As you can see, having a full Board of 1 pip Dice is
                        more beneficial than having 1 high pip Dice. Over time
                        you will want to Merge these together to get higher pips
                        and spawn more Dice. So filling your board and merging
                        when you have enough to spawn in another dice is the
                        most beneficial, excluding particular decks that
                        requires different play style.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={isWebpSupported() ? saveGoldWebp : saveGoldPng}
                            alt='always save 40k gold or 500 gems'
                        />
                    </div>
                    <span>
                        One of the best way to earn legendary is from buying
                        legend box for 500 gems or 40,000 gold. In order for you
                        to be ready to buy a legendary dice at any moment, you
                        should keep at least 40,000 gold or 500 gems at any
                        time. And you should buy any legendary regardless of
                        their usefulness because you can gain overall crit
                        damage.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? KnightTransformWebp
                                    : KnightTransformPng
                            }
                            alt='The Knight will trigger sacrifice dice and give sp when they transform'
                        />
                    </div>
                    <span>
                        Sacrifice Dice has a unique interaction with the knight
                        boss. When the knight boss cast its ability to flip your
                        board, any sacrifice dice on the board flipped will give
                        you sp according to their pip.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? sacrificeSpWebp
                                    : sacrificeSpPng
                            }
                            alt='Sacrifice dice only give sp per sacrifice pip'
                        />
                    </div>
                    <span>
                        Apart from the Knight boss interaction. Sacrifice Dice
                        has a unique properties that the trigger of the sp is
                        counted by the change in total pip of sacrifice dice. So
                        merging 2 sacrifice dice together give more sp than
                        merging mimic onto sacrifice. This effect can also be
                        triggered by assassin dice snipes, magician boss target,
                        and even, supplement merging onto sacrifice!
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? IceVsBlizzardWebp
                                    : IceVsBlizzardPng
                            }
                            alt='Ice is better than Blizzard'
                        />
                    </div>
                    <span>
                        This picture contains some clear explanations for ice
                        dice versus blizzard dice in pve. TLDR: Ice is better
                        than Blizzard in PVE.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? ShopRefreshesWebp
                                    : ShopRefreshesPng
                            }
                            alt='Shop refreshes every 6 hours and ad pvp show up every 1 hour'
                        />
                    </div>
                    <span>
                        Shop reset is one of the best way to rolling a
                        legendary, remember the window timing of shop reset.
                        Every 6 hours you can reset the shop by watching ads. Ad
                        PvP is a very efficient way to get you trophies, it may
                        be very efficient to only play ad pvp if you have
                        limited time to spend on the game.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? summonerMergeWebp
                                    : summonerMergePng
                            }
                            alt='summoner merge only gives fewer pip dice'
                        />
                    </div>
                    <span>
                        Summoner Dice can spawn a dice with less pip. So make a
                        consideration before merging high pip summoner, they can
                        produce 1-pip dice.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? supportDiceBoardWebp
                                    : supportDiceBoardPng
                            }
                            alt='position of support dice'
                        />
                    </div>
                    <span>
                        When you use support dice - Critical, Hell, Light Dice,
                        try putting the dice at those position for the highest
                        value. The placement in the picture ensures that every
                        dice on the board is buffed with the least support dice.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? duplicateSupportDiceWebp
                                    : duplicateSupportDicePng
                            }
                            alt='duplicates of support dice do not give extra buff'
                        />
                    </div>
                    <span>
                        Duplications of the same support dice do not increase
                        the buff effect. It only account in the support dice
                        that has the highest pip.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? elementBoardWebp
                                    : elementBoardPng
                            }
                            alt='placement of element'
                        />
                    </div>
                    <span>
                        This is the suggested ranked of the position of element
                        dice placement when using element in your deck ranking
                        from 1 -9 best to worst. It is arguable for the #2
                        placement because some people think that it is not very
                        effective when blizzard slow has not yet activated, some
                        may say it is good because it can hit boss off the
                        start.
                    </span>
                </li>
                <div className='divisor' />
                <li>
                    <div className='img-container'>
                        <img
                            src={
                                isWebpSupported()
                                    ? arenaCheatSheetWebp
                                    : arenaCheatSheetPng
                            }
                            alt='arena cheat sheet'
                        />
                    </div>
                    <span>
                        This is a cheat sheet for those who want to have a try
                        in arena. There are some auto picks that you should keep
                        in mind. Typhoon is the best dps in arena, it should be
                        auto picked. Sometimes if you do not have a good dps
                        dice, a slow can also win you game, so you should also
                        auto pick blizzard. And if you manage to pick both,
                        congratulation you just got a free 12 wins.
                    </span>
                </li>
            </ul>
        </Main>
    );
}
