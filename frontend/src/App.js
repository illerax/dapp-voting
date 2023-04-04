import React, {useEffect, useRef, useState} from "react";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    createTheme,
    CssBaseline,
    Grid,
    ThemeProvider,
    Typography
} from "@mui/material";


import {Contract, ethers} from "ethers";
import {VOTING_CONTRACT_ADDRESS} from "./constants"
import abi from "./abi/contractAbi";
import Web3Modal from "web3modal";
import SessionsList from "./components/SessionsList";
import AppModal from "./components/AppModal";
import CreateVotingSession from "./components/CreateVotingSession";
import VotePanel from "./components/VotePanel";
import VoteChart from "./components/VoteChart";

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#90c1aa',
        }
    },
});

function App() {
    const [walletConnected, setWalletConnected] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [sessions, setSessions] = useState([]);
    const [currentSessionResults, setCurrentSessionResults] = useState([]);
    const web3ModalRef = useRef();

    const createVotingSession = () => {
        setModalContent(<CreateVotingSession
            closeModal={() => setShowModal(false)}
            createSession={createSession}
        />)
        setShowModal(true)
    }


    const getProviderOrSigner = async (needSigner = false) => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new ethers.providers.Web3Provider(provider);

        const {chainId} = await web3Provider.getNetwork();
        if (chainId !== 97) {
            window.alert("Change network");
        }
        if (needSigner) {
            return web3Provider.getSigner();
        }
        return web3Provider;
    };

    const connectWallet = async () => {
        try {
            await getProviderOrSigner();
            setWalletConnected(true);
        } catch (error) {
            console.error(error);
        }
    };

    const createSession = async (topic, options) => {
        setIsWaiting(true);
        try {
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(VOTING_CONTRACT_ADDRESS, abi, signer);
            const tx = await contract.createSession(topic, options);
            await tx.wait();
        } catch (error) {
            processError(error);
        }
        setIsWaiting(false);
        getSessions();
    };

    const vote = async (option) => {
        setIsWaiting(true);
        try {
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(VOTING_CONTRACT_ADDRESS, abi, signer);
            const tx = await contract.vote(option);
            await tx.wait();
        } catch (error) {
            processError(error);
        }
        setIsWaiting(false);
        getCurrentSessionResults();
    };

    const getSessions = async () => {
        setIsWaiting(true);
        try {
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(VOTING_CONTRACT_ADDRESS, abi, signer);
            const sessionsResponse = await contract.getSessionsList();
            setSessions(sessionsResponse.split(";")
                .filter(str => str && str.length > 0)
                .map(str => str.split(":"))
                .map(arr => {
                    return {"id": arr[0], "topic": arr[1]}
                }));

        } catch (error) {
            processError(error);
        }
        setIsWaiting(false);
        getCurrentSessionResults();
    };

    const getCurrentSessionResults = async () => {
        setIsWaiting(true);
        try {
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(VOTING_CONTRACT_ADDRESS, abi, signer);
            const sessionsResponse = await contract.getVoteResults();
            setCurrentSessionResults(sessionsResponse.split(";")
                .filter(str => str && str.length > 0)
                .map(str => str.split(":"))
                .map(arr => {
                    return {"option": arr[0], "result": arr[1]}
                }));

        } catch (error) {
            processError(error);
        }
        setIsWaiting(false);
    };

    const getHistoricalSessionResults = async (id) => {
        setIsWaiting(true);
        try {
            const signer = await getProviderOrSigner(true);
            const contract = new Contract(VOTING_CONTRACT_ADDRESS, abi, signer);
            const sessionsResponse = await contract.getVoteResultsBySessionId(id);
            const results = sessionsResponse.split(";")
                .filter(str => str && str.length > 0)
                .map(str => str.split(":"))
                .map(arr => {
                    return {"option": arr[0], "result": arr[1]}
                });
            setModalContent(<VoteChart results={results}/>);
            setShowModal(true);
        } catch (error) {
            processError(error);
        }
        setIsWaiting(false);
    };

    const processError = (error) => {
        console.error(error);
        if (error.message === "Internal JSON-RPC error.") {
            setModalContent(error.data.message);
        } else {
            setModalContent(error.message);
        }
        setShowModal(true);
    }

    useEffect(() => {
        if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
                network: 97,
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
            getSessions();
        }
    }, [walletConnected]);

    return (
        <div className="App">
            <CssBaseline/>
            <ThemeProvider theme={theme}>
                <Container component="main">
                    <AppModal content={modalContent}
                              open={showModal}
                              handleClose={() => setShowModal(false)}/>
                    <Backdrop
                        sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                        open={isWaiting}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Box sx={{marginTop: 10}}>
                        <Grid container spacing={2} alignItems="center" sx={{marginTop: 10}} display="flex">
                            <Grid item={true} xs={4}>
                                <img className="logo-app" src={process.env.PUBLIC_URL + '/logo.png'}/>
                                <Typography variant="h6">Create new voting session</Typography>
                                <Button variant="contained"
                                        onClick={createVotingSession}>
                                    Create
                                </Button>
                            </Grid>
                            <Grid item={true} xs={4}>
                                <VotePanel
                                    topic={sessions && sessions.length > 0 ? sessions[0].topic : ""}
                                    options={currentSessionResults.map(it => it.option)}
                                    vote={vote}
                                />
                            </Grid>
                            <Grid item={true} xs={4}>
                                <VoteChart results={currentSessionResults}/>
                            </Grid>
                            <Grid item={true} xs={12}>
                                <SessionsList sessions={sessions} showResults={getHistoricalSessionResults}/>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        </div>
    );
}

export default App;
