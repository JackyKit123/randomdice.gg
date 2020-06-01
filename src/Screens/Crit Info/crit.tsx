import React from 'react';
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
import { RootState } from '../../Components/Redux Storage/store';
import Main from '../../Components/Main/main';
import Error from '../../Components/Error/error';
import LoadingScreen from '../../Components/Loading/loading';
import { fetchResponseForm, clearError } from '../Misc/fetchData';
import './crit.less';

export default function critData(): JSX.Element {
    const dispatch = useDispatch();
    const selection = useSelector(
        (state: RootState) => state.fetchGAPIresponseFormReducer
    );
    const { error, formData } = selection;
    type GraphData = {
        x: number;
        y: number;
    }[];

    let jsx;
    if (formData && formData.raw?.length > 0) {
        const scatterData = formData.raw.map(row => ({
            x: row[0],
            y: row[1],
        }));

        const avgData = formData.summarized
            .map((row, i) => ({
                x: i + 1,
                y: row[0],
            }))
            .filter(data => data.y);

        const medData = formData.summarized
            .map((row, i) => ({
                x: i + 1,
                y: row[1],
            }))
            .filter(data => data.y);

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
            8: 2500,
            9: 3000,
            10: 3500,
            11: 4000,
            12: 5000,
            13: 7000,
            14: 10000,
            15: 14000,
            16: 18000,
            17: 22000,
            18: 28000,
            19: 35000,
            20: 40000,
        };

        const converToTrophiesData = (classData: GraphData): GraphData => {
            return classData.map(row => {
                const clone = { ...row };
                clone.x = trophiesForClass[row.x];
                return clone;
            });
        };

        const scatterDataPerTrohpies = converToTrophiesData(scatterData);
        const avgDataPerTrohpies = converToTrophiesData(avgData);
        const medDataPerTrohpies = converToTrophiesData(medData);

        jsx = (
            <>
                <p>
                    The following data is collected through the community.
                    Please consider contributing by giving us your crit data in
                    this Google Form{' '}
                    <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://docs.google.com/forms/d/e/1FAIpQLSceQ9wJM5i5OhRO55NV_ycnfPbDvmmkH-9Or2o3ZGFDxUILQg/viewform?usp=sf_link'
                    >
                        HERE
                    </a>
                    . The data you submitted will be immediately added below
                    upon refreshing.
                </p>
                <div className='filter-divisor' />
                <div className='chart-container'>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domain={{
                            x: [1, 20],
                            y: [0, 2036],
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
                            data={scatterData}
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
                            data={avgData}
                        />
                        <VictoryLine
                            interpolation='bundle'
                            style={{
                                data: {
                                    stroke: '#a600a6',
                                    strokeWidth: 1,
                                },
                            }}
                            data={medData}
                        />
                    </VictoryChart>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domain={{
                            x: [0, 40000],
                            y: [0, 2036],
                        }}
                        domainPadding={{ x: [0, 5] }}
                    >
                        <VictoryLabel
                            text='Crit % Per Trophie'
                            x={175}
                            y={30}
                            textAnchor='middle'
                        />
                        <VictoryAxis
                            label='Trohpies'
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
                            data={scatterDataPerTrohpies}
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
                            data={avgDataPerTrohpies}
                        />
                        <VictoryLine
                            interpolation='bundle'
                            style={{
                                data: {
                                    stroke: '#a600a6',
                                    strokeWidth: 1,
                                },
                            }}
                            data={medDataPerTrohpies}
                        />
                    </VictoryChart>
                </div>
                <div className='filter-divisor' />
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
                                <th scope='row'>Average</th>
                                {formData.summarized.slice(0, 10).map(row => (
                                    <td key={`crit-table-avg-${row[0]}`}>
                                        {Math.round(row[0])
                                            ? Math.round(row[0] * 100) / 100
                                            : ''}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th scope='row'>Median</th>
                                {formData.summarized.slice(0, 10).map(row => (
                                    <td key={`crit-table-med-${row[1]}`}>
                                        {Math.round(row[1])
                                            ? Math.round(row[1] * 100) / 100
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
                                <th scope='row'>Average</th>
                                {formData.summarized.slice(10, 20).map(row => (
                                    <td key={`crit-table-avg-${row[0]}`}>
                                        {Math.round(row[0])
                                            ? Math.round(row[0] * 100) / 100
                                            : ''}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th scope='row'>Median</th>
                                {formData.summarized.slice(10, 20).map(row => (
                                    <td key={`crit-table-med-${row[1]}`}>
                                        {Math.round(row[1])
                                            ? Math.round(row[1] * 100) / 100
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
                                <th>Average</th>
                                <th>Median</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.summarized.map((row, i) => (
                                <tr key={`crit-table-row-${i + 1}`}>
                                    <td>{i + 1}</td>
                                    <td>{trophiesForClass[i + 1]}</td>
                                    <td key={`crit-table-avg-${row[0]}`}>
                                        {Math.round(row[0])
                                            ? Math.round(row[0] * 100) / 100
                                            : ''}
                                    </td>
                                    <td key={`crit-table-med-${row[1]}`}>
                                        {Math.round(row[1])
                                            ? Math.round(row[1] * 100) / 100
                                            : ''}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    } else if (error) {
        jsx = (
            <Error
                error={error}
                retryFn={(): void => {
                    clearError(dispatch);
                    fetchResponseForm(dispatch);
                }}
            />
        );
    } else {
        jsx = <LoadingScreen />;
    }
    return <Main title='Crti% Data' className='crit-data' content={jsx} />;
}
