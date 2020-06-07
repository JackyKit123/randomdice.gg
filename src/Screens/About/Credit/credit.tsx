import React from 'react';
import Main from '../../../Components/Main/main';
import './credit.less';
import JackyKit from './JackyKit.webp';
import Sweeney from './Sweeney.webp';
import Campion from './Campion.webp';
import FinDiesel from './FinDiesel.webp';
import TAXA from './TAXA.webp';
import BadLuck from './BadLuck.webp';
import Staple from './Staple.webp';
import Enry from './Enry.webp';

export default function Credit(): JSX.Element {
    return (
        <Main
            title='Credit'
            className='credit'
            content={
                <>
                    <h3>Website Development</h3>
                    <ul>
                        <li>
                            The creator of this website: JackyKit{' '}
                            <div className='img-container'>
                                <img src={JackyKit} alt='icon of JackyKit' />
                            </div>
                        </li>
                        <li>
                            Backend server support: Sweeney{' '}
                            <div className='img-container'>
                                <img src={Sweeney} alt='icon of Sweeney' />
                            </div>
                        </li>
                    </ul>
                    <h3>Content Provider</h3>
                    <ul>
                        <li>
                            Original Deck Database Creator: Campion{' '}
                            <div className='img-container'>
                                <img src={Campion} alt='icon of Campion' />
                            </div>
                        </li>
                        <li>
                            Original Deck Database Creator: FinDiesel{' '}
                            <div className='img-container'>
                                <img src={FinDiesel} alt='icon of FinDiesel' />
                            </div>
                        </li>
                        <li>
                            Original Decks and Calculator Maker: TAXA{' '}
                            <div className='img-container'>
                                <img src={TAXA} alt='icon of TAXA' />
                            </div>
                        </li>
                        <li>
                            Decks Maker: BadLuck™{' '}
                            <div className='img-container'>
                                <img src={BadLuck} alt='icon of BadLuck' />
                            </div>
                        </li>
                    </ul>
                    <h3>Community Manger</h3>
                    <ul>
                        <li>
                            Reddit and Discord Manager: Staple{' '}
                            <div className='img-container'>
                                <img src={Staple} alt='icon of Staple' />
                            </div>
                        </li>
                        <li>
                            Wiki Creator: Enry{' '}
                            <div className='img-container'>
                                <img src={Enry} alt='icon of Enry' />
                            </div>
                        </li>
                    </ul>
                    <h3>Patreon Supporter</h3>
                    <ul>
                        <li>
                            Oh, it looks like we don&apos;t have any supporter
                            yet. You can be the first one to support this
                            website by joining out pateron at{' '}
                            <a
                                target='_blank'
                                href='https://www.patreon.com/RandomDiceCommunityWebsite'
                                rel='noopener noreferrer'
                            >
                                https://www.patreon.com/RandomDiceCommunityWebsite
                            </a>
                            .
                        </li>
                    </ul>
                    <h3>The Community</h3>
                    <ul>
                        <li>Last but not least, everyone of you.</li>
                        <li>
                            Anyone is welcome to join us into making this
                            website better, if you want to contribute content,
                            or if you are a web developer, and you want to help
                            us, please do not hesitate to contact JackyKit.
                        </li>
                    </ul>
                </>
            }
        />
    );
}
