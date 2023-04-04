import React, {useState} from 'react';
import {Box, Button, TextField} from "@mui/material";

const CreateVotingSession = ({createSession, closeModal}) => {

    const [voteTopic, setVoteTopic] = useState("");
    const [optionsList, setOptionsList] = useState({
        '1': '',
        '2': '',
        '3': '',
        '4': '',
        '5': '',
    });

    const create = () => {
        const options = Object.values(optionsList).filter(str => str.length > 0);
        closeModal();
        createSession(voteTopic, options);
    }

    const isCreateDisabled = () => {
        return voteTopic.length <= 0 || Object.values(optionsList).filter(str => str.length > 0).length < 2;
    }

    const updateOption = (key, val) => {
        const updatedValue = {[key]: val};
        setOptionsList(prevState => ({...prevState, ...updatedValue}));
    }

    return (
        <Box>
            <Box sx={{marginBottom: 5}}>
                <TextField id="vote-topic"
                           value={voteTopic}
                           onInput={event => setVoteTopic(event.target.value)}
                           label="Vote topic"
                           variant="outlined"
                           size="small"/>
            </Box>
            {
                Object.entries(optionsList).map(entry => {
                        const [key, value] = entry;
                        return <Box key={`vote-option-box-${key}`}>
                            <TextField id={`vote-option-${key}`}
                                       key={`vote-option-${key}`}
                                       value={value}
                                       onInput={event => updateOption(key, event.target.value)}
                                       label={`Option ${key}`}
                                       variant="outlined"
                                       size="small"/>
                        </Box>
                    }
                )
            }
            <Box sx={{marginTop: 5}}>
                <Button variant="contained"
                        disabled={isCreateDisabled()}
                        onClick={create}>
                    Create
                </Button>
                <Button variant="outlined" sx={{marginLeft: 10}}
                        onClick={closeModal}>
                    Close
                </Button>
            </Box>
        </Box>
    )
}

export default CreateVotingSession;