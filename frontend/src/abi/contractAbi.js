export default [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "topic",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string[]",
                "name": "options",
                "type": "string[]"
            }
        ],
        "name": "SessionCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_topic",
                "type": "string"
            },
            {
                "internalType": "string[]",
                "name": "_options",
                "type": "string[]"
            }
        ],
        "name": "createSession",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSessionsList",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getVoteResults",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "id",
                "type": "int256"
            }
        ],
        "name": "getVoteResultsBySessionId",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "option",
                "type": "string"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stat eMutability": "payable",
        "type": "receive"
    }
]