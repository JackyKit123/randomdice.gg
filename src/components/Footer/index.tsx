import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReddit,
  faDiscord,
  faPatreon,
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { navDiscord } from 'misc/customGaEvent';

export default function Footer(): JSX.Element {
  const communityList = {
    discord: {
      name: 'discord',
      icon: faDiscord,
      hyperlink: 'https://discord.randomdice.gg',
      googleAnalyticTrack: true,
    },
    reddit: {
      name: 'reddit',
      icon: faReddit,
      hyperlink: 'https://www.reddit.com/r/randomdice/',
      googleAnalyticTrack: false,
    },
    patreon: {
      name: 'patreon',
      icon: faPatreon,
      hyperlink: 'https://www.patreon.com/RandomDiceCommunityWebsite',
      googleAnalyticTrack: false,
    },
  };
  return (
    <footer>
      <div className='container upper'>
        <div className='footerBar'>
          <div className='container'>
            Join the community!
            <div className='community'>
              {Object.values(communityList).map(community => (
                <div key={community.name}>
                  <a
                    href={community.hyperlink}
                    className={community.name}
                    target='_blank'
                    rel='noopener noreferrer'
                    onClick={(): void => {
                      if (community?.googleAnalyticTrack) navDiscord();
                    }}
                  >
                    <FontAwesomeIcon icon={community.icon} /> {community.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='container lower'>
        <div className='footerBar'>
          <div className='container'>
            <span id='copyright'>
              &#169; Copyright {new Date().getFullYear()} Random Dice Community
            </span>
            <div className='footer-link'>
              <Link to='/about/terms'>Terms and Conditions</Link>
              <Link to='/about/privacy'>Privacy Policy</Link>
              <Link to='/about/disclaimer'>Disclaimer</Link>
              <Link to='/about/us'>About Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
