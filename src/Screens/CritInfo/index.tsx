import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import {
    VictoryChart,
    VictoryLabel,
    VictoryAxis,
    VictoryScatter,
    VictoryTheme,
    VictoryLine,
    VictoryLegend,
} from 'victory';
import * as math from 'mathjs';
import firebase from 'firebase/app';
import { RootState } from 'Redux/store';
import Main from 'Components/Main';
import Error from 'Components/Error';
import LoadingScreen from 'Components/Loading';
import ShareButtons from 'Components/ShareButton';
import findMaxCrit from 'Misc/findMaxCrit';
import { fetchCrit, fetchDices } from 'Firebase';
import { OPEN_POPUP } from 'Redux/PopUp Overlay/types';
import { CLEAR_ERRORS } from 'Redux/Fetch Firebase/types';

export default function critDataCollection(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchCritDataReducer
    );
    const { dices } = useSelector(
        (state: RootState) => state.fetchDicesReducer
    );
    const { critData, error } = selection;
    const { user } = useSelector((state: RootState) => state.authReducer);
    const database = firebase.database();
    const [typingTrophies, setTypingTrophies] = useState(0);
    const [typingCrit, setTypingCrit] = useState(0);
    const [myTrophies, setMyTrophies] = useState(0);
    const [myCrit, setMyCrit] = useState(111);

    useEffect(() => {
        if (
            user &&
            user !== 'awaiting auth state' &&
            critData &&
            critData[user.uid]
        ) {
            setMyCrit(critData[user.uid].crit);
            setMyTrophies(critData[user.uid].trophies);
        }
    }, [user, critData]);

    const maxCrit = findMaxCrit(dices);
    let jsx;
    if (
        dices?.length &&
        critData &&
        Object.values(critData).every(
            data => data.trophies >= 0 && data.crit >= 111
        )
    ) {
        const critDataArr = Object.values(critData).filter(
            data => data.trophies && data.crit
        );
        const scatterDataByTrophies = critDataArr.map(data => ({
            x: data.trophies > 9000 ? 9000 : data.trophies,
            y: data.crit,
        }));
        const trophiesForClass: {
            [key: number]: number;
        } = {
            1: 0,
            2: 300,
            3: 600,
            4: 1000,
            5: 1300,
            6: 1600,
            7: 2000,
            8: 2300,
            9: 2600,
            10: 3000,
            11: 3300,
            12: 3600,
            13: 4000,
            14: 4500,
            15: 5000,
            16: 5500,
            17: 6000,
            18: 7000,
            19: 8000,
            20: 9000,
        };
        const scatterDataRoundedDownToClass = critDataArr.map(data => {
            const rank =
                Number(
                    Object.entries(trophiesForClass)
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        .sort(([_, a], [__, b]) =>
                            // eslint-disable-next-line no-nested-ternary
                            a > b ? -1 : a < b ? 1 : 0
                        )
                        .find(
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            ([_, trophies]) => trophies <= data.trophies
                        )?.[0]
                ) || 1;
            return {
                rank,
                crit: data.crit,
            };
        });

        const processedData: {
            [key: number]: {
                min: number;
                max: number;
                avg: number;
                median: number;
                trophies: number;
            };
        } = {};
        for (let i = 1; i <= 20; i += 1) {
            const critDataPerClass = scatterDataRoundedDownToClass
                .filter(data => data.rank === i)
                .map(data => data.crit);

            const min =
                critDataPerClass.length > 0 ? math.min(critDataPerClass) : 0;
            const max =
                critDataPerClass.length > 0 ? math.max(critDataPerClass) : 0;
            const avg =
                critDataPerClass.length > 0 ? math.mean(critDataPerClass) : 0;
            const median =
                critDataPerClass.length > 0 ? math.median(critDataPerClass) : 0;
            const trophies = trophiesForClass[i];
            processedData[i] = {
                min,
                max,
                avg,
                median,
                trophies,
            };
        }

        jsx = (
            <>
                <p>
                    The following data is collected through the community.
                    Please consider contributing by giving us your crit data in
                    here. The data collected is anonymous.
                </p>
                {user && user !== 'awaiting auth state' ? (
                    <>
                        <p>
                            Please enter your data in the following form. The
                            data you entered will go live immediately. You do
                            not need to enter your rank, it is calculated
                            automatically based on your trophies.
                        </p>
                        <p>
                            Note that your trophies count should be a positive
                            integer while your crit damage should be between 111
                            - {maxCrit}. If you are class 20 or above, your
                            trophies count will be rounded down to 9,000
                            trophies.
                        </p>
                        <form>
                            <label htmlFor='my-trophies'>
                                Your Trophies:
                                <input
                                    type='number'
                                    className={myTrophies < 0 ? 'invalid' : ''}
                                    min={0}
                                    step={1}
                                    defaultValue={
                                        critData[user.uid]?.trophies ||
                                        myTrophies
                                    }
                                    onChange={(evt): void => {
                                        evt.persist();
                                        clearTimeout(typingTrophies);
                                        setTypingTrophies(() =>
                                            window.setTimeout(async (): Promise<
                                                void
                                            > => {
                                                const trophies = Number(
                                                    evt.target.value
                                                );
                                                setMyTrophies(trophies);
                                                if (trophies >= 0 && user) {
                                                    await Promise.all([
                                                        database
                                                            .ref(
                                                                '/last_updated/critData'
                                                            )
                                                            .set(
                                                                new Date().toISOString()
                                                            ),
                                                        database
                                                            .ref(
                                                                `/critData/${user.uid}/crit`
                                                            )
                                                            .set(myCrit),
                                                        database
                                                            .ref(
                                                                `/critData/${user.uid}/trophies`
                                                            )
                                                            .set(trophies),
                                                    ]);
                                                    fetchCrit(dispatch);
                                                }
                                            }, 500)
                                        );
                                    }}
                                />
                            </label>
                            <label htmlFor='my-rank'>
                                Your PvP Rank:
                                <input
                                    type='number'
                                    value={
                                        Number(
                                            Object.entries(trophiesForClass)
                                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                .sort(([_, a], [__, b]) =>
                                                    // eslint-disable-next-line no-nested-ternary
                                                    a > b ? -1 : a < b ? 1 : 0
                                                )
                                                .find(
                                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                                    ([_, trophies]) =>
                                                        trophies <= myTrophies
                                                )?.[0]
                                        ) || 1
                                    }
                                    disabled
                                />
                            </label>
                            <label htmlFor='my-trophies'>
                                Your Crit:
                                <input
                                    type='number'
                                    className={
                                        myCrit < 111 || myCrit > maxCrit
                                            ? 'invalid'
                                            : ''
                                    }
                                    min={111}
                                    step={1}
                                    max={maxCrit}
                                    defaultValue={
                                        critData[user.uid]?.crit || myCrit
                                    }
                                    onChange={(evt): void => {
                                        evt.persist();
                                        clearTimeout(typingCrit);
                                        setTypingCrit(() =>
                                            window.setTimeout(async (): Promise<
                                                void
                                            > => {
                                                const crit = Number(
                                                    evt.target.value
                                                );
                                                setMyCrit(crit);
                                                if (
                                                    crit >= 111 &&
                                                    crit < maxCrit &&
                                                    user
                                                ) {
                                                    await Promise.all([
                                                        database
                                                            .ref(
                                                                '/last_updated/critData'
                                                            )
                                                            .set(
                                                                new Date().toISOString()
                                                            ),
                                                        database
                                                            .ref(
                                                                `/critData/${user.uid}/crit`
                                                            )
                                                            .set(crit),
                                                        database
                                                            .ref(
                                                                `/critData/${user.uid}/trophies`
                                                            )
                                                            .set(myTrophies),
                                                    ]);
                                                    fetchCrit(dispatch);
                                                }
                                            }, 500)
                                        );
                                    }}
                                />
                            </label>
                        </form>
                    </>
                ) : (
                    <p>
                        Please{' '}
                        <button
                            type='button'
                            onClick={(): void => {
                                dispatch({
                                    type: OPEN_POPUP,
                                    payload: 'login',
                                });
                            }}
                        >
                            Login
                        </button>{' '}
                        to enter your data.
                    </p>
                )}
                <hr className='divisor' />
                <div className='chart-container'>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domain={{
                            x: [1, 20],
                            y: [0, maxCrit],
                        }}
                        domainPadding={{ x: [0, 5] }}
                    >
                        <VictoryLabel
                            text='Crit % Per Class'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Class'
                            fixLabelOverlap
                            style={{
                                axisLabel: {
                                    padding: 30,
                                },
                            }}
                            tickValues={[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]}
                        />
                        <VictoryAxis dependentAxis />
                        <VictoryLegend
                            x={50}
                            y={70}
                            orientation='vertical'
                            gutter={20}
                            colorScale={['#a600a6', '#160073']}
                            data={[{ name: 'Average' }, { name: 'Median' }]}
                        />
                        <VictoryScatter
                            name='No Buff'
                            size={1}
                            data={scatterDataRoundedDownToClass.map(data => ({
                                x: data.rank,
                                y: data.crit,
                            }))}
                            symbol='plus'
                            style={{
                                data: {
                                    fill: '#ff7400',
                                },
                            }}
                        />
                        <VictoryLine
                            interpolation='bundle'
                            style={{
                                data: {
                                    stroke: '#160073',
                                    strokeWidth: 1,
                                },
                            }}
                            data={Object.entries(processedData).map(
                                ([rank, data]) => ({
                                    x: rank,
                                    y: data.avg,
                                })
                            )}
                        />
                        <VictoryLine
                            interpolation='bundle'
                            style={{
                                data: {
                                    stroke: '#a600a6',
                                    strokeWidth: 1,
                                },
                            }}
                            data={Object.entries(processedData).map(
                                ([rank, data]) => ({
                                    x: rank,
                                    y: data.median,
                                })
                            )}
                        />
                    </VictoryChart>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domain={{
                            x: [0, 9000],
                            y: [0, maxCrit],
                        }}
                        domainPadding={{ x: [0, 5] }}
                    >
                        <VictoryLabel
                            text='Crit % Per Trophies'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Trophies'
                            fixLabelOverlap
                            style={{
                                axisLabel: {
                                    padding: 30,
                                },
                            }}
                        />
                        <VictoryAxis dependentAxis />
                        <VictoryLegend
                            x={50}
                            y={70}
                            orientation='vertical'
                            gutter={20}
                            colorScale={['#a600a6', '#160073']}
                            data={[{ name: 'Average' }, { name: 'Median' }]}
                        />
                        <VictoryScatter
                            name='No Buff'
                            size={1}
                            data={scatterDataByTrophies}
                            symbol='plus'
                            style={{
                                data: {
                                    fill: '#ff7400',
                                },
                            }}
                        />
                        <VictoryLine
                            interpolation='bundle'
                            style={{
                                data: {
                                    stroke: '#160073',
                                    strokeWidth: 1,
                                },
                            }}
                            data={Object.values(processedData).map(data => ({
                                x: data.trophies,
                                y: data.avg,
                            }))}
                        />
                        <VictoryLine
                            interpolation='bundle'
                            style={{
                                data: {
                                    stroke: '#a600a6',
                                    strokeWidth: 1,
                                },
                            }}
                            data={Object.values(processedData).map(data => ({
                                x: data.trophies,
                                y: data.median,
                            }))}
                        />
                    </VictoryChart>
                </div>
                <hr className='divisor' />
                <div className='table-container'>
                    <table className='horizontal'>
                        <tbody>
                            <tr>
                                <th scope='row'>Class</th>
                                {Object.keys(trophiesForClass)
                                    .slice(0, 10)
                                    .map(classNum => (
                                        <td
                                            key={`crit-table-class-${classNum}`}
                                        >
                                            {classNum}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Trophies</th>
                                {Object.values(trophiesForClass)
                                    .slice(0, 10)
                                    .map(trophies => (
                                        <td
                                            key={`crit-table-trophies-${trophies}`}
                                        >
                                            {trophies}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Minimum</th>
                                {Object.entries(processedData)
                                    .slice(0, 10)
                                    .map(([rank, data]) => (
                                        <td key={`crit-table-min-${rank}`}>
                                            {Math.round(data.min)
                                                ? Math.round(data.min * 100) /
                                                  100
                                                : ''}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Average</th>
                                {Object.entries(processedData)
                                    .slice(0, 10)
                                    .map(([rank, data]) => (
                                        <td key={`crit-table-avg-${rank}`}>
                                            {Math.round(data.avg)
                                                ? Math.round(data.avg * 100) /
                                                  100
                                                : ''}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Median</th>
                                {Object.entries(processedData)
                                    .slice(0, 10)
                                    .map(([rank, data]) => (
                                        <td key={`crit-table-med-${rank}`}>
                                            {Math.round(data.median)
                                                ? Math.round(
                                                      data.median * 100
                                                  ) / 100
                                                : ''}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Maximum</th>
                                {Object.entries(processedData)
                                    .slice(0, 10)
                                    .map(([rank, data]) => (
                                        <td key={`crit-table-max-${rank}`}>
                                            {Math.round(data.max)
                                                ? Math.round(data.max * 100) /
                                                  100
                                                : ''}
                                        </td>
                                    ))}
                            </tr>
                        </tbody>
                    </table>
                    <table className='horizontal'>
                        <tbody>
                            <tr>
                                <th scope='row'>Class</th>
                                {Object.keys(trophiesForClass)
                                    .slice(10, 20)
                                    .map(classNum => (
                                        <td
                                            key={`crit-table-class-${classNum}`}
                                        >
                                            {classNum}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Trophies</th>
                                {Object.values(trophiesForClass)
                                    .slice(10, 20)
                                    .map(trophies => (
                                        <td
                                            key={`crit-table-trophies-${trophies}`}
                                        >
                                            {trophies}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Minimum</th>
                                {Object.entries(processedData)
                                    .slice(10, 20)
                                    .map(([rank, data]) => (
                                        <td key={`crit-table-min-${rank}`}>
                                            {Math.round(data.min)
                                                ? Math.round(data.min * 100) /
                                                  100
                                                : ''}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Average</th>
                                {Object.entries(processedData)
                                    .slice(10, 20)
                                    .map(([rank, data]) => (
                                        <td key={`crit-table-avg-${rank}`}>
                                            {Math.round(data.avg)
                                                ? Math.round(data.avg * 100) /
                                                  100
                                                : ''}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Median</th>
                                {Object.entries(processedData)
                                    .slice(10, 20)
                                    .map(([rank, data]) => (
                                        <td key={`crit-table-med-${rank}`}>
                                            {Math.round(data.median)
                                                ? Math.round(
                                                      data.median * 100
                                                  ) / 100
                                                : ''}
                                        </td>
                                    ))}
                            </tr>
                            <tr>
                                <th scope='row'>Maximum</th>
                                {Object.entries(processedData)
                                    .slice(10, 20)
                                    .map(([rank, data]) => (
                                        <td key={`crit-table-max-${rank}`}>
                                            {Math.round(data.max)
                                                ? Math.round(data.max * 100) /
                                                  100
                                                : ''}
                                        </td>
                                    ))}
                            </tr>
                        </tbody>
                    </table>
                    <table className='vertical'>
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Trophies</th>
                                <th>Minimum</th>
                                <th>Average</th>
                                <th>Median</th>
                                <th>Maximum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(processedData).map(
                                ([rank, data]) => (
                                    <tr key={`crit-table-row-${rank}`}>
                                        <td>{rank}</td>
                                        <td>{data.trophies}</td>
                                        <td key={`crit-table-min-${rank}`}>
                                            {Math.round(data.min)
                                                ? Math.round(data.min * 100) /
                                                  100
                                                : ''}
                                        </td>
                                        <td key={`crit-table-avg-${rank}`}>
                                            {Math.round(data.avg)
                                                ? Math.round(data.avg * 100) /
                                                  100
                                                : ''}
                                        </td>
                                        <td key={`crit-table-med-${rank}`}>
                                            {Math.round(data.median)
                                                ? Math.round(
                                                      data.median * 100
                                                  ) / 100
                                                : ''}
                                        </td>
                                        <td key={`crit-table-max-${rank}`}>
                                            {Math.round(data.max)
                                                ? Math.round(data.max * 100) /
                                                  100
                                                : ''}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
                <hr className='divisor' />
                <ShareButtons name='Random Dice Players Critical Data' />
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    dispatch({ type: CLEAR_ERRORS });
                    fetchCrit(dispatch);
                    fetchDices(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return (
        <Main title='Crit% Data' className='crit-data'>
            <Helmet>
                <title>Random Dice Crit% Data</title>
                <meta property='og:title' content='Random Dice Crit% Data' />
                <meta
                    name='og:description'
                    content='Data gathered from the Random Dice community for their respective crit% across different ranks! Compare your own crit% to the majority of the player base.'
                />
                <meta
                    name='description'
                    content='Data gathered from the Random Dice community for their respective crit% across different ranks! Compare your own crit% to the majority of the player base.'
                />
            </Helmet>
            {jsx}
        </Main>
    );
}
