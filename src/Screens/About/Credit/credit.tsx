import React from 'react';
import { Link } from 'react-router-dom';
import Main from '../../../Components/Main/main';
import './credit.less';
import JackyKitJpg from './People/JackyKit.jpg';
import SweeneyJpg from './People/Sweeney.jpg';
import CampionJpg from './People/Campion.jpg';
import FinDieselJpg from './People/FinDiesel.jpg';
import TAXAJpg from './People/TAXA.jpg';
import BadLuckJpg from './People/BadLuck.jpg';
import StapleJpg from './People/Staple.jpg';
import EnryJpg from './People/Enry.jpg';
import CrunchyJpg from './People/Crunchy.jpg';

export default function Credit(): JSX.Element {
    return (
        <Main title='Credit' className='credit'>
            <h3>Website Development</h3>
            <ul>
                <li>
                    The creator of this website: JackyKit{' '}
                    <div className='img-container'>
                        <img src={JackyKitJpg} alt='icon of JackyKit' />
                    </div>
                </li>
                <li>
                    Backend server support: Sweeney{' '}
                    <div className='img-container'>
                        <img src={SweeneyJpg} alt='icon of Sweeney' />
                    </div>
                </li>
            </ul>
            <h3>Content Provider</h3>
            <ul>
                <li>
                    Original Deck Database Creator: Campion{' '}
                    <div className='img-container'>
                        <img src={CampionJpg} alt='icon of Campion' />
                    </div>
                </li>
                <li>
                    Original Deck Database Creator: FinDiesel{' '}
                    <div className='img-container'>
                        <img src={FinDieselJpg} alt='icon of FinDiesel' />
                    </div>
                </li>
                <li>
                    Original Decks and Calculator Maker: TAXA{' '}
                    <div className='img-container'>
                        <img src={TAXAJpg} alt='icon of TAXA' />
                    </div>
                </li>
                <li>
                    Decks Maker: BadLuck™{' '}
                    <div className='img-container'>
                        <img src={BadLuckJpg} alt='icon of BadLuck' />
                    </div>
                </li>
                <li>
                    Deck Guide Writer: Crunchy{' '}
                    <div className='img-container'>
                        <img src={CrunchyJpg} alt='icon of Crunchy' />
                    </div>
                </li>
            </ul>
            <h3>Community Manger</h3>
            <ul>
                <li>
                    Reddit and Discord Manager: Staple{' '}
                    <div className='img-container'>
                        <img src={StapleJpg} alt='icon of Staple' />
                    </div>
                </li>
                <li>
                    Wiki Creator: Enry{' '}
                    <div className='img-container'>
                        <img src={EnryJpg} alt='icon of Enry' />
                    </div>
                </li>
            </ul>
            <h3>
                <Link to='/about/patreon'>Patreon Supporters</Link>
            </h3>
            <h3>The Community</h3>
            <ul>
                <li>Last but not least, everyone of you.</li>
                <li>
                    Anyone is welcome to join us into making this website
                    better, if you want to contribute content, or if you are a
                    web developer, and you want to help us, please do not
                    hesitate to contact JackyKit.
                </li>
            </ul>
        </Main>
    );
}
