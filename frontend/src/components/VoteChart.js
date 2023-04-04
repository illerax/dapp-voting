import React from 'react';
import {Box} from "@mui/material";
import {Axis, BarSeries, Grid, XYChart} from '@visx/xychart';

const VoteChart = ({results}) => {

    const tickLabelProps = (tickValue, tickIndex) =>
        ({
            textAnchor: "start",
            fontSize: 8,
            angle: 45,
            dy: "-0.5em"
        });

    return (
        <Box>
            <XYChart
                height={300}
                width={350}
                xScale={{type: 'band', paddingInner: 0.6, paddingOuter: 0.1}}
                yScale={{type: 'linear', nice: true}}
            >
                <Grid columns={false} numTicks={4}/>
                <BarSeries dataKey="Voting" data={results}
                           xAccessor={(d) => d.option}
                           yAccessor={(d) => d.result}/>
                <Axis orientation="bottom"
                      tickLabelProps={tickLabelProps}
                      hideTicks/>
                <Axis
                    orientation="right"
                    hideAxisLine
                    numTicks={1}
                    tickFormat={(value) => Number(value)}
                />
            </XYChart>
        </Box>
    )
}

export default VoteChart;