import React, {useState} from 'react';
import {Box, Button, FormControlLabel, Radio, RadioGroup, Typography} from "@mui/material";

const VotePanel = ({topic, options, vote}) => {

    const [selectedOption, setSelectedOption] = useState();


    const processVote = () => {
        vote(selectedOption);
    }

    const isVoteDisabled = () => {
        return !selectedOption || selectedOption.length <= 0;
    }


    return (
        <Box>
            <Typography variant="h5">Current session question:</Typography>
            <Typography variant="h6">{topic}</Typography>
            <RadioGroup
                value={selectedOption ?? ""}
                onChange={event => setSelectedOption(event.target.value)}
            >
                {
                    options.map(option => <FormControlLabel key={`radio-${option}`} value={option} control={<Radio/>}
                                                            label={option}/>
                    )
                }
            </RadioGroup>
            <Box sx={{marginTop: 5}}>
                <Button variant="contained"
                        disabled={isVoteDisabled()}
                        onClick={processVote}>
                    Vote
                </Button>
            </Box>
        </Box>
    )
}

export default VotePanel;