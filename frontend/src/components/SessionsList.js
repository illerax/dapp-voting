import React from 'react';
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';

const SessionsList = ({sessions, showResults}) => {

    return (
        <>
            <Typography align='left' variant="h5">Voting sessions:</Typography>
            <List>
                {
                    sessions.sort((a, b) => Number(b.id) - Number(a.id)).map(s =>
                        <ListItem key={`li-${s.id}`}
                                  style={{cursor: 'pointer'}}
                                  onClick={() => showResults(s.id)}>
                            <ListItemAvatar>
                                <Avatar>
                                    <HowToVoteOutlinedIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={s.id}
                                secondary={s.topic}
                            />
                        </ListItem>
                    )
                }

            </List>
        </>
    )
}

export default SessionsList;