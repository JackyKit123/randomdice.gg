import React from 'react';
import Main from '../../../Components/Main/main';
import './patchnote.less';

export default function patchNotes(): JSX.Element {
    return (
        <Main title='Patch Note' className='wiki patch-note'>
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Version</th>
                            <th>Release Date</th>
                            <th>Release Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                3.15.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-05-01 02:13:30</td>
                            <td>
                                - “User Report” Improved
                                <br />
                                <p>
                                    - Bug Fixed - Maximum SP of Metastasis Dice
                                    Bonus Monster in Co-op Mode
                                    <br />
                                    - High Class Matching System Improved
                                    <br />
                                    - Mirror mode Basic SP 100 &gt;&gt; 200
                                    <br />- Arena Critical Damage 777% &gt;&gt;
                                    500%
                                </p>
                                <p>[Balance Changes]</p>
                                <p>- Leon Boss</p>
                                <p>
                                    The Howling Skill has been modified to
                                    affect only half of the Dice
                                </p>
                                <p>- Silencer Boss</p>
                                <p>The lock Skill Target 1 &gt;&gt; 2</p>
                                <p>- Co-op Mode</p>
                                <p>
                                    After Wave 50, the Enemy HP growth factor
                                    has been increased
                                </p>
                                <p>- Dice Changes</p>
                                <p>
                                    Gamble Dice - Base Damage 1 &gt;&gt; 7, Base
                                    Damage per Power-up 50 &gt;&gt; 77, Max
                                    Damage 100 &gt;&gt; My Critical
                                    Damage&nbsp;% (E.G. If you have 1000% crit
                                    your highest hit is 1000)
                                </p>
                                <p>
                                    Critical Dice - Critical Chance increase per
                                    Scale 2% &gt;&gt; 8%, Critical Chance per
                                    Power-up 5% &gt;&gt; 1%
                                </p>
                                <p>
                                    Bow Dice - Ability Damage 60 &gt;&gt; 80,
                                    Attack Damage Per Class 4 &gt;&gt; 8,
                                    Ability Damage per Class 12 &gt;&gt; 16
                                </p>
                                <p>
                                    Wave Dice - Increase damage per Distance 35
                                    &gt;&gt; 60, When Power-up increase Damage
                                    per Distance 20 &gt;&gt; 18, When Class-up
                                    increase Damage per Distance 7 &gt;&gt; 12
                                </p>
                                <p>
                                    Combo Dice - Increase Damage per Combo 10
                                    &gt;&gt; 8, Combo Damage per Class 5
                                    &gt;&gt; 2
                                </p>
                                <p>
                                    Solar Dice - Transform Condition: 1, 4
                                    &gt;&gt; 1, 4, 9. Base Damage 20 &gt;&gt;
                                    35, Damage per Power-up 10 &gt;&gt; 11
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.14.2
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-04-24 21:39:23</td>
                            <td>Fixed some bugs.</td>
                        </tr>
                        <tr>
                            <td>
                                3.14.1
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-04-23 07:50:15</td>
                            <td>
                                Fixed Wave Dice damage bug
                                <br />
                                <p>Fixed some bugs</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.14
                                <br />
                                Random Dice&nbsp;: PvP Defense
                            </td>
                            <td>2020-04-16 05:01:18</td>
                            <td>
                                <p>
                                    - Landmine Dice Special Mine Damage Bug
                                    Corrected
                                    <br />- Synchronize Dice attack speed
                                    <br />- Stabilize forced shutdown during
                                    co-op mode
                                    <br />- Add new boss &quot;LEON&quot;
                                    <br />- Add 3 new dice types
                                    <br />- Dice Balance Change
                                    <br />- In Co-op mode after Wave 50, every
                                    second wave has a boss.
                                    <br />- In Co-op mode Wave 50 onwards to
                                    obtain 3 cards per wave
                                </p>
                                <p>- Bow Dice</p>
                                <ul>
                                    <li>Fires powerful arrows on 5 attack</li>
                                    <li>Basic Attack Damage: 40</li>
                                    <li>Damage per Powerup: 20</li>
                                    <li>Damage per Class: 4</li>
                                    <li>Ability Damage: 60</li>
                                    <li>Ability Damage per Power-Up: 40</li>
                                    <li>Ability Damage per Class: 12</li>
                                    <li>Basic Attack Speed: 0.8</li>
                                    <li>Attack Speed per Class: 0.01</li>
                                </ul>
                                <p>- Light Dice</p>
                                <ul>
                                    <li>Attack Speed Buff 7% &gt; 6%</li>
                                    <li>
                                        Buff ability per Power-up 3% &gt; 1%
                                    </li>
                                    <li>
                                        Buff ability per Class 0.5% &gt; 0.3%
                                    </li>
                                </ul>
                                <p>- Wave Dice</p>
                                <ul>
                                    <li>
                                        The greater the distance between dice
                                        and Enemy the greater the Damage
                                    </li>
                                    <li>&nbsp;Basic Attack Damage: 10</li>
                                    <li>Damage per Power-Up: 5</li>
                                    <li>Damage per Class: 10</li>
                                    <li>Increased Damage per Distance: 35</li>
                                    <li>Increase Damage per Power-Up: 20</li>
                                    <li>Increase Damage per Class: 7</li>
                                    <li>Basic Attack Speed: 1</li>
                                </ul>
                                <p>- Combo Dice</p>
                                <ul>
                                    <li>
                                        When increasing Combo count, Increases
                                        Damage too
                                    </li>
                                    <li>Basic Attack Damage: 10</li>
                                    <li>Damage per Power-Up: 10</li>
                                    <li>Damage per Class: 10</li>
                                    <li>Combo Bonus: 10</li>
                                    <li>Combo Bonus per Power-Up: 1</li>
                                    <li>Combo Bonus per Class: 5</li>
                                    <li>Basic Attack Speed: 1</li>
                                </ul>
                                <p>- Light Sword Dice</p>
                                <ul>
                                    <li>
                                        It gives proportional damage to normal
                                        Enemy as much as half the remaining HP
                                    </li>
                                    <li>
                                        The boss receives proportional damage of
                                        the remaining HP
                                    </li>
                                    <li>Basic Attack Damage: 30 &gt; 40</li>
                                    <li>Chance of Light Sword: 4% &gt; 3%</li>
                                    <li>
                                        Chance of Light Sword per Power-Up: 3%
                                        &gt; 1%
                                    </li>
                                    <li>
                                        Chance of Light Sword per Class: 3% &gt;
                                        0.3%
                                    </li>
                                    <li>
                                        [NEW] Current HP Damage for boss: 0.3%
                                    </li>
                                </ul>
                                <p>
                                    [NEW] Current Damage per Power-up: 0.05%
                                    [MAX 0.5%]
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.13.2
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-03-25 09:48:51</td>
                            <td>
                                - Fixed bugs in the Co-op mode.
                                <br />
                                <p>- Server Stabilization.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.12.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-03-12 20:36:49</td>
                            <td>
                                - Fixed locked dice bug
                                <br />
                                <p>
                                    - Fixed bug with Switch Dice &amp; Light
                                    Dice
                                    <br />
                                    - Store update bug fixed
                                    <br />
                                    - Fixed box open bug
                                    <br />
                                    - Fixed a bug related to co-op boss
                                    appearance
                                    <br />- Fixed time dice &amp; light dice
                                    bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.11.0
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>
                                2020-03-12
                                <p>13:28:47</p>
                            </td>
                            <td>
                                Dice Balance Update
                                <p>- Lock Dice&nbsp;:</p>
                                <ul>
                                    <li> Basic Lock Duration (5 &gt; 3)</li>
                                    <li>
                                        {' '}
                                        Lock Duration per Power- up (0 &gt; 0.5)
                                    </li>
                                    <li>
                                        {' '}
                                        Lock Duration per Class-up (0 &gt; 0.2)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Spike Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Spike duration per Power-up (0 &gt; 0.5)
                                        (MAX 4sec)
                                    </li>
                                    <li>
                                        {' '}
                                        Spike Cooldown Reduce per Class-up (0
                                        &gt; 0.2)
                                    </li>
                                    <li> Is now immune to Attack Speed Buff</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Gear Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Connect Power-up Ability per Class-up
                                        (0.20% &gt; 0.40%)
                                    </li>
                                    <li> Basic Attack Speed (1.5 &gt; 1.2)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Modified Electric Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Attack speed per Class-up (0.02 &gt; 0)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Landmine Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Landmine Cooldown Reduce per Class-up (0
                                        &gt; 0.05)
                                    </li>
                                    <li> Basic Set-up Cycle (11 &gt; 6)</li>
                                    <li> Is now immune to Attack Speed Buff</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Element Dice&nbsp;:</p>
                                <ul>
                                    <li> Element Damage (3% &gt; 4%)</li>
                                    <li>
                                        {' '}
                                        Element Orbital Cycle time (8 &gt; 7.2)
                                    </li>
                                    <li>
                                        {' '}
                                        Element Orbital Cycle time per Power-up
                                        0.8 (MAX Orbital Cycle 4)
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.10.1
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-03-06 11:26:34</td>
                            <td>- Fixed some bugs</td>
                        </tr>
                        <tr>
                            <td>
                                3.10.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-03-05 20:27:27</td>
                            <td>
                                - Time dice bug fixed.
                                <br />
                                <p>- Game loading bug fixed.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.9.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-03-05 04:46:51</td>
                            <td>
                                - [New] Dice Battle Field Skin
                                <br />
                                <p>
                                    - [New] Trophy Progress New Reward (After
                                    4000)
                                    <br />
                                    - [New] Legendary Dice] Time Dice
                                    <br />
                                    - [New] In-App Package
                                    <br />
                                    - [New] Arena Battle Result
                                    <br />
                                    - [New] Add HelpShift
                                    <br />
                                    - [New] More Language Option
                                    <br />
                                    - Magician Boss Meteor Bug fixed
                                    <br />
                                    - Hell Dice Description fixed
                                    <br />
                                    - Blizzard Dice Cool-down Bug Fixed
                                    <br />
                                    - Some Assassin Dice Bug fixed
                                    <br />- Black Screen Bug Fixed
                                </p>
                                <p>Dice Balance Changes</p>
                                <p>- Poison Dice&nbsp;:</p>
                                <ul>
                                    <li> Basic Poison Damage (30 &gt; 50)</li>
                                    <li>
                                        {' '}
                                        Poison Damage per Power-up (30 &gt; 50)
                                    </li>
                                    <li> Poison Damage per Class (3 &gt; 5)</li>
                                    <li>
                                        {' '}
                                        [Delete] Attack Speed Decrease per Class
                                        (0.02 &gt; 0)
                                    </li>
                                    <li> Basic Attack Speed (1.5 &gt; 1.3)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Energy Dice&nbsp;:</p>
                                <ul>
                                    <li> SP-Damage Rate (2% &gt; 4%)</li>
                                    <li>
                                        {' '}
                                        SP-Damage Rate per Power-up (0.5% &gt;
                                        0.6%)
                                    </li>
                                    <li>
                                        {' '}
                                        SP-Damage Rate per Class (0.2% &gt;
                                        0.3%)
                                    </li>
                                    <li> Basic Attack Speed (1 &gt; 1.3)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Death Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Instant Death Chance per Power-up (0.2%
                                        &gt; 0.5%)
                                    </li>
                                    <li> Basic Attack Speed (1.5 &gt; 1.2)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Gear Dice&nbsp;:</p>
                                <ul>
                                    <li> Basic Attack Speed (1 &gt; 1.5)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Landmine Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Basic Landmine Damage (200 &gt; 450)
                                    </li>
                                    <li>
                                        {' '}
                                        [Delete] Install Landmine Cooldown Rate
                                        per Class (0.05 &gt; 0)
                                    </li>
                                    <li>
                                        {' '}
                                        Basic install Landmine Cooldown Rate (6
                                        &gt; 11)
                                    </li>
                                    <li> Splash Range (0.2 &gt; 0.8)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Blizzard Dice&nbsp;:</p>
                                <ul>
                                    <li> Blizzard slow rate (10% &gt; 5%)</li>
                                    <li>
                                        {' '}
                                        Blizzard slow rate per Power-up (5% &gt;
                                        1%)
                                    </li>
                                    <li>
                                        {' '}
                                        Blizzard slow rate per Class (2% &gt;
                                        0.5%)
                                    </li>
                                    <li>
                                        {' '}
                                        [Delete] Attack speed decrease per Class
                                        (0.01 &gt; 0)
                                    </li>
                                    <li> Basic Attack Speed (1.2 &gt; 1)</li>
                                    <li>
                                        {' '}
                                        [New] The enemy slows down in proportion
                                        to the Dice scale
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Typhoon Dice&nbsp;:</p>
                                <ul>
                                    <li> Basic Attack Damage (26 &gt; 20)</li>
                                    <li> Basic Attack Speed (0.5 &gt; 0.6)</li>
                                    <li>
                                        {' '}
                                        [Delete] First transform duration growth
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Element Dice&nbsp;:</p>
                                <ul>
                                    <li> Basic Attack Damage (30 &gt; 35)</li>
                                    <li> Element Damage (2% &gt; 3%)</li>
                                    <li>
                                        {' '}
                                        [Delete] Element Damage per Power-up
                                    </li>
                                    <li> [Delete] Element Damage per Class</li>
                                    <li>
                                        {' '}
                                        Element Orbital Cycle time (3 &gt; 8)
                                    </li>
                                    <li>
                                        {' '}
                                        [New] Element Orbital Cycle time per
                                        Power-up 0.75 (MAX orbital cycle 5)
                                    </li>
                                    <li>
                                        {' '}
                                        [Delete] Attack Speed Decrease per Class
                                        (0.02 &gt; 0)
                                    </li>
                                    <li> Basic attack speed (0.9 &gt; 0.8)</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.8.2
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-02-19 19:55:48</td>
                            <td>
                                - Server Stabilization
                                <br />
                                <p>- Fixed some bugs</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.7.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-02-12 00:40:15</td>
                            <td>
                                - Server Optimization
                                <br />
                                <p>
                                    - Fixed Emoji touch bugs
                                    <br />- Fixed some bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.6.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-02-10 23:09:50</td>
                            <td>- Fixed some bugs</td>
                        </tr>
                        <tr>
                            <td>
                                3.5.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-02-07 02:18:08</td>
                            <td>
                                - Fixed bugs related to elemental dice upgrade
                                <br />
                                <p>
                                    - Fixed an Infinite Loading Bug
                                    <br />- Fixed Other Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.4.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-02-06 03:08:39</td>
                            <td>
                                - Dice Balance Update
                                <br />
                                <p>
                                    - [NEW] Mail Box Functions
                                    <br />
                                    - [NEW] Server Select Functions
                                    <br />
                                    - [NEW] Arena Game Board Skin
                                    <br />
                                    - [NEW] Spanish Language
                                    <br />
                                    - Fixed Bug
                                    <br />- Minimum Wave Time 45sec &gt;&gt;
                                    60sec
                                </p>
                                <p>Dice Balances</p>
                                <p>- Iron Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Attack Damage per class (20 &gt; 10)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Ice Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Freeze effect per stack (20% &gt; 5%)
                                    </li>
                                    <li>
                                        {' '}
                                        Freeze effect per Power-up (8% &gt; 2%)
                                    </li>
                                    <li>
                                        {' '}
                                        Freeze effect per Class (1% &gt; 0.5%)
                                    </li>
                                    <li> Max Slow Effect (60% &gt; 50%)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Spike Dice&nbsp;:</p>
                                <ul>
                                    <li> Spike duration (3sec &gt; 2sec)</li>
                                    <li>
                                        {' '}
                                        [Delete] Spike Duration per Power-up
                                    </li>
                                    <li>
                                        {' '}
                                        [Delete] Spike set-up Cooldown (0.1 &gt;
                                        0)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Teleport Dice&nbsp;:</p>
                                <ul>
                                    <li> Basic Attack Damage (40 &gt; 50)</li>
                                    <li>
                                        {' '}
                                        Attack speed per Class (0 &gt; 0.02)
                                    </li>
                                    <li> Basic Attack Speed (1.5 &gt; 1)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Absorb Dice&nbsp;:</p>
                                <ul>
                                    <li> Absorb SP per Power-up (1 &gt; 3)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Modified Electric Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Electric Damage per Power-up (20 &gt;
                                        40)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Landmine Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Mine set-up Cooldown per Class (0.5 &gt;
                                        0.05)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Blizzard Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Freeze Effect per stack (20% &gt; 5%)
                                    </li>
                                    <li>
                                        {' '}
                                        Freeze Effect per Power-up (10% &gt; 5%)
                                    </li>
                                    <li>
                                        {' '}
                                        Blizzard Cooldown (10sec &gt; 8sec)
                                    </li>
                                    <li> Max slow Effect (60% &gt; 50%)</li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.3.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-02-01 10:26:57</td>
                            <td>- Fixed Random Arena Bugs</td>
                        </tr>
                        <tr>
                            <td>
                                3.2.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-01-29 10:09:27</td>
                            <td>
                                - Modify Landmine Dice Information Window
                                <br />
                                <p>
                                    - Modify the Thorn Dice Information Window
                                    <br />
                                    - Fixed some bugs in &quot;RANDOM
                                    ARENA&quot;
                                    <br />
                                    - Fixed some other bugs
                                    <br />
                                    <br />- Fixed some bugs in &quot;RANDOM
                                    ARENA&quot; reward
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.1.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-01-28 17:10:15</td>
                            <td>
                                - Modify Landmine Dice Information Window
                                <br />
                                <p>
                                    - Modify the Thorn Dice Information Window
                                    <br />
                                    - Fixed some bugs in THE ARENA
                                    <br />- Fixed some other bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                3.0.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-01-28 03:44:19</td>
                            <td>
                                - Some Dice adjustment
                                <br />
                                <p>
                                    - Add 5 new dice
                                    <br />
                                    - Add new content &quot;estimated
                                    ground&quot; - Arena
                                    <br />
                                    - Fixed some bugs
                                    <br />
                                    - Christmas Package Ends
                                    <br />- Electric Dice&nbsp;:
                                </p>
                                <ul>
                                    <li>
                                        {' '}
                                        Increased Basic / Class-up / Electric
                                        damage (10 &gt; 30 / 2 &gt; 3 / 2 &gt;
                                        3)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Iron Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Increased Class-up / Power-up / ATK
                                        speed (10 &gt; 20 / 50 &gt; 100 / 2 &gt;
                                        1)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Thorn Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        [New] The installed Thorn damages the
                                        enemy passing over it every second for a
                                        long period of time
                                    </li>
                                    <li>
                                        {' '}
                                        If Enemy step on installed Thorn, it
                                        doesn&apos;t disappear anymore
                                    </li>
                                    <li> Basic Thorn set-up Cooldown (5)</li>
                                    <li>
                                        {' '}
                                        Thorn set-up Cooldown reduce per
                                        Power-up (1)
                                    </li>
                                    <li>
                                        {' '}
                                        Basic thorn damage has decreased (200
                                        &gt; 110)
                                    </li>
                                    <li>
                                        {' '}
                                        Thorn set-up Cooldown has increased (4
                                        &gt; 5)
                                    </li>
                                    <li>
                                        {' '}
                                        Thorn set-up Cooldown reduce per Class
                                        (0.1)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Modified Electric Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        [New] Increases attack targets per scale
                                        of the dice
                                    </li>
                                    <li>
                                        {' '}
                                        Basic Electric Damage has increase (30
                                        &gt; 50)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Landmine Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Basic Attack Damage has increased (100
                                        &gt; 200)
                                    </li>
                                    <li>
                                        {' '}
                                        Increase Mine set-up Cooldown per Class
                                        (0.05 &gt; 0.5)
                                    </li>
                                    <li>
                                        {' '}
                                        Special Mine Set-up chance has increased
                                        (1% &gt; 10%)
                                    </li>
                                    <li>
                                        {' '}
                                        [New] Increased Special Mine Set-up
                                        chance (1%)
                                    </li>
                                    <li>
                                        {' '}
                                        Increased Special Mine set-up chance
                                        (5%)
                                    </li>
                                    <li>
                                        {' '}
                                        Special Mine Damage has increased
                                        (Present hp 1% &gt; Maximum HP 1%)
                                    </li>
                                    <li>
                                        {' '}
                                        Increased Special Mine Damage per Class
                                        (0.5%) /
                                    </li>
                                    <li>
                                        {' '}
                                        Increased Special Mine Damage per
                                        Power-up (0.5%)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- [New Dice] Tribute Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        If the dice is merged or gets attacked,
                                        the SP is acquired according to dice
                                        scales / Basic Attack Damage (10)
                                    </li>
                                    <li>
                                        {' '}
                                        Attack Damage Increased per Class (10)
                                    </li>
                                    <li>
                                        {' '}
                                        Attack Damage increased per Power-up (1)
                                    </li>
                                    <li> Basic ATK Speed (1)</li>
                                    <li> SP production per Dice Scale (80)</li>
                                    <li> Target (Front)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- [New Dice] Gear Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Attack Power increases with number of
                                        Gear Dice connected
                                    </li>
                                    <li> Basic attack Damage (180)</li>
                                    <li>
                                        {' '}
                                        Attack Damage Increased per Class (10)
                                    </li>
                                    <li>
                                        {' '}
                                        Attack Damage Increased per Power-up
                                        (50)
                                    </li>
                                    <li> Basic Attack Speed (1)</li>
                                    <li>
                                        {' '}
                                        Attack Damage Increased per Connection
                                        (3%)
                                    </li>
                                    <li>
                                        {' '}
                                        Increased Connection Buff per Class
                                        (0.2%)
                                    </li>
                                    <li>
                                        {' '}
                                        Increased Connection Buff per Power-up
                                        (5%)
                                    </li>
                                    <li> Target (Front)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- [New Dice] Typhoon Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Attack Speed increases to maximum by
                                        repeating a total of two transformations
                                        at intervals
                                    </li>
                                    <li>
                                        {' '}
                                        In second transform, all attack has 100%
                                        Critical chance
                                    </li>
                                    <li> Basic Attack Damage (26)</li>
                                    <li>
                                        {' '}
                                        Attack Damage increase per Power-up (3)
                                    </li>
                                    <li>
                                        {' '}
                                        Attack Damage increased per Power-up
                                        (30)
                                    </li>
                                    <li> Basic Attack Speed (0.5)</li>
                                    <li>
                                        {' '}
                                        Attack speed in first transform (0.1)
                                    </li>
                                    <li>
                                        {' '}
                                        Attack speed in second transform (0.1)
                                    </li>
                                    <li>
                                        {' '}
                                        Critical chance in second transform
                                        (100%)
                                    </li>
                                    <li>
                                        {' '}
                                        Second transform intervals (1 second)
                                    </li>
                                    <li> Target (Front)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- [New Dice] Nutriment Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        When merged with a dice, Dice does not
                                        change and scale on the increase by one
                                    </li>
                                    <li> Basic Attack Damage (10)</li>
                                    <li>
                                        {' '}
                                        Attack Damage increased per Class (10)
                                    </li>
                                    <li>
                                        {' '}
                                        Attack Damage increased per Power-up
                                        (10)
                                    </li>
                                    <li> Attack speed (1.5)</li>
                                    <li> Target (Front)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- [New Dice] Transfer Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        When merged with a Dice, summon a
                                        special Enemy to opponent. And Enemy who
                                        can generate SP in Co-op Mode
                                    </li>
                                    <li> Basic Attack Damage (25)</li>
                                    <li>
                                        {' '}
                                        Attack Damage increased per Class (10)
                                    </li>
                                    <li>
                                        {' '}
                                        Attack damage increased per Power-up
                                        (30)
                                    </li>
                                    <li> Attack speed (1)</li>
                                    <li>
                                        {' '}
                                        Summon Enemy HP&nbsp;: Enemy&apos;s HP
                                        10% per Dice scale
                                    </li>
                                    <li>
                                        {' '}
                                        Get SP in Co-op mode&nbsp;: Double SP as
                                        from wave per Dice scale
                                    </li>
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2.7.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-01-15 05:56:05</td>
                            <td>
                                - Database stabilization
                                <br />
                                <p>
                                    - Modify notice UI
                                    <br />
                                    - Fixed dice abnormal position bug
                                    <br />- Fixed other minor bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2.6.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-01-09 01:51:11</td>
                            <td>
                                - Change the way Nuclear Dice are targeted
                                <br />
                                <p>
                                    - Fixed a double-shooting bug on a Lock Dice
                                    <br />
                                    - Fixed PVP Mode bug
                                    <br />- Fixed other minor bug
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2.5.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-01-07 04:36:41</td>
                            <td>
                                [2.5.0 Update]
                                <br />
                                <p>
                                    - Fixed crack dice damage bug
                                    <br />
                                    - Fixed hell dice instant death effect bug
                                    <br />
                                    - Fixed ability stats of sand dice
                                    <br />- Fixed other minor bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2.4.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2020-01-01 06:31:04</td>
                            <td>
                                2.4.0 Release Note
                                <br />
                                <p>
                                    - Added new dice&nbsp;: Gift dice&nbsp;:
                                    Gold is presented to myself as a gift every
                                    certain time in game.
                                    <br />
                                    - Fixed a bug that some skills were applied
                                    to bosses
                                    <br />
                                    - Fixed a bug that sometimes does not
                                    disable a daily store items
                                    <br />
                                    - Fixed a bug that sometimes Magician Boss
                                    stops
                                    <br />
                                    - Fixed a bug that Magician Boss would
                                    sometimes not use the Meteor Skill
                                    <br />- Fixed a bug that initializes the
                                    account data
                                </p>
                                <p>- Modified Value of Dice</p>
                                <p>- Nuclear Dice&nbsp;:</p>
                                <ul>
                                    <li> Modified effect speed</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Energy Dice&nbsp;:(SP-DMG Rate)&nbsp;:</p>
                                <ul>
                                    <li> Class-Up (0.5 &gt; 0.2)</li>
                                    <li> Power-Up (1 &gt; 0.5)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />- Co-op Mode (PvE Beta Mode) Ranking
                                    will be reset on January 2
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2.3.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2019-12-22 00:02:47</td>
                            <td>
                                - Stabilize the server.
                                <br />
                                <p>
                                    - Localized bug fix
                                    <br />
                                    - Modify BGM volume bugs
                                    <br />- Fixed some dice(growth, summoner)
                                    bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                2.2.0
                                <br />
                                <p>Random Dice&nbsp;: PvP Defense</p>
                            </td>
                            <td>2019-12-19 23:44:08</td>
                            <td>
                                - Season: The Magician - PvP battle mode changes
                                <p>- Added Magician Boss</p>
                                <p>- New type of dice [gun dice]</p>
                                <p>- Updated for Christmas theme</p>
                                <p>- Increased cooperative battle ranking</p>
                                <p>
                                    - Added battle record and report function in
                                    PvP mode
                                </p>
                                <p>
                                    - Adjust the overall ability balance of the
                                    dice
                                </p>
                                <p>- Remove AI</p>
                                <p>- Added game re-entry function</p>
                                <p>
                                    - Increased difficulty after 40 turns in
                                    collaborative mode
                                </p>
                                <p>- Added advanced emoji</p>
                                <p>
                                    - Co-op Mode (PvE Beta mode) Ranking will be
                                    reset with Apple Update 2.2.0
                                </p>
                                <p>
                                    - Poison, Mine, Crack, Infect Dice algorithm
                                    changed (Base+Class-up) x the spot on a dice
                                    + Power-up
                                </p>
                                <p>- Mine Dice&nbsp;:</p>
                                <ul>
                                    <li> Power-up (1&gt;3)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Crack Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Changed basic / Power-up / Class-up (3%
                                        / 3% / 1% &gt; 2% / 5% / 0.2%)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Critical Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Changed Basic / Power-up / Class-up (3%
                                        / 3% / 1% &gt; 2% / 5% / 0.2%)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Light Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Changed Basic / Class-up (8% / 1% &gt;
                                        7% / 0.5%)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Electric Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Increased basic damage and electrical
                                        damage (20/10 &gt; 30/20)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Modified Electric Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Increased Electrical damage of Power-up
                                        (20 &gt; 30)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Death Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Decreased instant death rate of Class-up
                                        (2% &gt; 0.2%)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Mighty Wind Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Changed Power-up / ATK Speed / ATK Speed
                                        when transforming (20 / 0.5 / 0.075 &gt;
                                        30 / 0.6 / 0.1)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Nuclear Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Changed tracking Algorithm (the most HP
                                        enemy &gt; front enemy)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Solar Dice&nbsp;:</p>
                                <ul>
                                    <li> Increased base damage (10 &gt; 20)</li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>- Elemental Dice&nbsp;:</p>
                                <ul>
                                    <li>
                                        {' '}
                                        Decreased Elemental Speed (1 &gt; 1.2)
                                    </li>
                                </ul>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />
                                </p>
                                <p>
                                    <br />- Fixed Bug&nbsp;: Unlimited amount of
                                    SP increased when killing an enemy &gt; Max
                                    50
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.27.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-11-27 15:56:41</td>
                            <td>
                                - Fixed bug that boss didn&apos;t die
                                <br />
                                <p>
                                    - Fixed pvp / co-op sync bug
                                    <br />- Fixed assassin dice bug
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.26.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-11-27 01:43:31</td>
                            <td>
                                - Fixed nuclear dice damage bug
                                <br />
                                <p>
                                    - Fixed effect bugs when using the switch
                                    dice
                                    <br />
                                    - Fixed security issues
                                    <br />- Fixed some bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.24.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-11-14 11:40:23</td>
                            <td>
                                - Optimized DB for Royal Dice Season 2<br />
                                <p>
                                    - Nerfed Mine Dice
                                    <br />- Fixed Some Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.23.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-11-13 23:52:55</td>
                            <td>
                                - Modified Mighty Wind / Growth Timer When Using
                                Switch Dice
                                <br />
                                <p>
                                    - Nerfed Energy Dice Class Upgrade Figures
                                    <br />- Fixed Some Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.22.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-11-12 19:24:25</td>
                            <td>
                                - Add “New” Dice (Energy, Switch, Element)
                                <br />
                                <p>
                                    - Modified Teleport Dice (Apply to boss,
                                    Only one)
                                    <br />
                                    - Modified Lock Dice (Apply to boss)
                                    <br />
                                    - Nerfed Crack Dice
                                    <br />- Fixed Some Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.20.1
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-11-04 20:55:55</td>
                            <td>- Fixed Some Bugs</td>
                        </tr>
                        <tr>
                            <td>
                                1.20.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-11-01 20:08:44</td>
                            <td>- Fixed Some Bugs</td>
                        </tr>
                        <tr>
                            <td>
                                1.19.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-10-30 17:43:13</td>
                            <td>
                                - Fixed matching system error
                                <br />
                                <p>- Fixed Some Bugs</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.18.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-10-29 23:04:51</td>
                            <td>- Fixed Some Bugs</td>
                        </tr>
                        <tr>
                            <td>
                                1.17.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-10-26 17:34:20</td>
                            <td>- Fixed Some Bugs</td>
                        </tr>
                        <tr>
                            <td>
                                1.16.1
                                <br />
                            </td>
                            <td>2019-10-25 15:29:59</td>
                            <td>
                                - Modified Solar Dice Effect
                                <br />
                                <p>
                                    - Optimized Friendly Game
                                    <br />
                                    - Fixed Daily Quest Initializing
                                    <br />- Fixed Some Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.16.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-10-24 14:58:30</td>
                            <td>- Fixed Some Bugs</td>
                        </tr>
                        <tr>
                            <td>
                                1.15.1
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-10-23 16:33:46</td>
                            <td>
                                - Adjusted drag and drop sensitivity of dice
                                <br />
                                <p>- Fixed some bugs</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.15.0
                                <br />
                            </td>
                            <td>2019-10-22 16:08:35</td>
                            <td>
                                - Buffed basic ability (Spike, Teleport,
                                Modified Electric Dice)
                                <br />
                                <p>
                                    - Increased upgrade amount of ability (Fire,
                                    Electric, Wind, Poison, Ice, Iron, Broken,
                                    Gamble, Lock, Spike, Teleport, Modified
                                    Electric, LandMine, Lighted Sword, Shield,
                                    Blizzard Dice)
                                    <br />
                                    - Increased amount of power-up in game
                                    (Spike, Critical, Modified Electric,
                                    Blizzard Dice)
                                    <br />
                                    - Buffed Critical Probability of Critical
                                    Dice
                                    <br />
                                    - Adjusted Speed Reduction ability of
                                    Blizzard Dice
                                    <br />- Fixed Some bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.14.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-10-21 16:15:13</td>
                            <td>
                                - Added ’NEW’ Classes
                                <br />
                                <p>
                                    - Added Royal Premium Pass
                                    <br />
                                    - Added PVP Friend Mode
                                    <br />
                                    - Added Gift Box in Case of Lose
                                    <br />
                                    - Added More Gold in Case of Win
                                    <br />
                                    - Added Speed Enemy in PVP Mode
                                    <br />
                                    - Buffed Landmine Dice (10% chance to
                                    install special landmine)
                                    <br />
                                    - Buffed Nuclear Dice (General Enemy -
                                    Instantaneous Death / Boss - Health
                                    Proportional Damage)
                                    <br />
                                    - Nerfed Effect of Overlay Deceleration of a
                                    Blizzard Dice
                                    <br />
                                    - Nerfed Absorb Dice Attack Speed
                                    <br />- Fixed Some Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.13.1
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-10-11 13:07:43</td>
                            <td>
                                - Modified Solar Dice Effect
                                <br />
                                <p>- Fixed Some Bugs</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.13.0
                                <br />
                            </td>
                            <td>2019-10-10 12:20:04</td>
                            <td>
                                - Added ‘NEW’ Dice (Solar, Assassin)
                                <br />
                                <p>
                                    - Added 7-Eye Dice
                                    <br />
                                    - Increased Fire Dice Splash Range
                                    <br />
                                    - Modified Hell Dice Chance of Instant Death
                                    <br />
                                    - Modified Lighted Sword Dice Attack Speed
                                    <br />
                                    - Modified Sand Dice Slow Amount
                                    <br />
                                    - Buffed Poison, Infect, Summoner Dice
                                    <br />
                                    - Modified Enemy Appearing
                                    <br />- Fixed Some Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.12.0
                                <br />
                                <p>Royal Dice&nbsp;: Random Defense</p>
                            </td>
                            <td>2019-09-28 17:31:08</td>
                            <td>
                                - Fixed Data Loading Bug
                                <br />
                                <p>
                                    - Modified Trophy Balances
                                    <br />- Fixed Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.12.0
                                <br />
                                <p>Royal Dice ㅤ</p>
                            </td>
                            <td>2019-09-26 05:08:09</td>
                            <td>
                                - Fixed Data Loading Bug
                                <br />
                                <p>
                                    - Modified Trophy Balances
                                    <br />- Fixed Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.12.0
                                <br />
                            </td>
                            <td>2019-09-24 13:08:04</td>
                            <td>
                                - Fixed Data Loading Bug
                                <br />
                                <p>
                                    - Modified Trophy Balances
                                    <br />- Fixed Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.10.0
                                <br />
                                <p>Royal Dice ㅤ</p>
                            </td>
                            <td>2019-09-24 09:29:16</td>
                            <td>
                                -Modified Dice Balances
                                <br />
                                <p>-Fixed Some Bugs</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.10.0
                                <br />
                            </td>
                            <td>2019-09-20 23:43:18</td>
                            <td>
                                -Modified Dice Balances
                                <br />
                                <p>-Fixed Some Bugs</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.9.0
                                <br />
                            </td>
                            <td>2019-09-19 20:40:57</td>
                            <td>
                                - Modified Matching Range (1/2, 3/4, 5/6, 7,
                                8/9, 10, 11/etc..)
                                <br />
                                <p>
                                    - Modified Class Range
                                    <br />
                                    - Modified Trophy Amount
                                    <br />
                                    - Added Splash Image
                                    <br />
                                    - Added New Class
                                    <br />
                                    - Modified Some Balances
                                    <br />- Fixed Some Bugs
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.8.0
                                <br />
                                <p>Royal Dice ㅤ</p>
                            </td>
                            <td>2019-09-19 07:52:45</td>
                            <td>
                                - Modified Matching Class Range
                                <br />
                                <p>
                                    - Fixed Friend Mode Bugs ...etc
                                    <br />- Optimized Application
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.8.0
                                <br />
                            </td>
                            <td>2019-09-11 15:28:43</td>
                            <td>
                                - Modified Matching Class Range
                                <br />
                                <p>
                                    - Fixed Friend Mode Bugs ...etc
                                    <br />- Optimized Application
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.6.1
                                <br />
                            </td>
                            <td>2019-09-06 00:01:35</td>
                            <td>- Optimized App Size</td>
                        </tr>
                        <tr>
                            <td>
                                1.5.0
                                <br />
                                <p>Royal Dice ㅤ</p>
                            </td>
                            <td>2019-09-04 23:43:10</td>
                            <td>
                                - Difficulty Adjustment.
                                <br />
                                <p>- Optimized Balancing.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.5.0
                                <br />
                            </td>
                            <td>2019-09-04 21:00:41</td>
                            <td>
                                - Difficulty Adjustment.
                                <br />
                                <p>- Optimized Balancing.</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.4.0
                                <br />
                            </td>
                            <td>2019-09-03 22:55:20</td>
                            <td>
                                - Fixed some bugs.
                                <br />
                                <p>- Optimized&nbsp;!</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.3.0
                                <br />
                            </td>
                            <td>2019-09-03 10:59:51</td>
                            <td>
                                - Fixed infinite loading issue!
                                <br />
                                <p>- Optimized Server!</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.2.1
                                <br />
                                <p>Royal Dice ㅤ</p>
                            </td>
                            <td>2019-09-02 17:48:46</td>
                            <td>
                                - Fixed some Bugs
                                <br />
                                <p>- Optimized!!</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.2.1
                                <br />
                            </td>
                            <td>2019-08-31 15:48:14</td>
                            <td>
                                - Fixed some Bugs
                                <br />
                                <p>- Optimized!!</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                1.0
                                <br />
                            </td>
                            <td>
                                2019-08-29 23:17:54
                                <br />
                                <p>
                                    <br />
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Main>
    );
}
