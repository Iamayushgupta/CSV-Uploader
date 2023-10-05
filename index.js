const fsp = require('fs').promises;
const fs = require("fs");
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

// Constants
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const BATCH_SIZE = 10; // Number of rows to process in each batch
const SPREADSHEET_ID = "1MljFUBE-nBTcSUOPJg9XnJtm1UUNk9oXt3v7gLEvAb8"; // Replace with your Spreadsheet ID

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Function to load saved credentials if they exist
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fsp.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null; // Return null if no saved credentials exist
    }
}

// Function to save credentials to a token file
async function saveCredentials(client) {
    const content = await fsp.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fsp.writeFile(TOKEN_PATH, payload);
}

// Function to authenticate with Google Sheets API
async function authenticateGoogleSheetsAPI() {
    let client = await loadSavedCredentialsIfExist();
    if (!client) {
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await saveCredentials(client);
        }
    }
    return client;
}

// Function to process a batch of rows and update the spreadsheet
async function processBatch(sheets, rows) {
    try {
        // Filter out the required columns from rows
        const columnsRequiredInSpreadSheet = [0,1,2,3,4,5,6];
        const actualDataWithSpecifiedColumns = []
        rows.forEach((ele)=>{
            if(ele){
                var temp=[]
                for(var i=0;i<ele.length;i++){
                    if(columnsRequiredInSpreadSheet.includes(i)){
                        temp.push(ele[i])
                    }
                }
                actualDataWithSpecifiedColumns.push(temp)
            }
        })


        // Update the spreadsheet with the filtered data
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "A:Z",
            valueInputOption: 'RAW',
            resource: { values: actualDataWithSpecifiedColumns }
        });
        if (response && response.data) {
            console.log(`${response.data.updates.updatedCells} cells updated.`);
        } else {
            console.error('Invalid API response:', response);
        }
    } catch (error) {
        console.error('Error updating rows:', error);
    }
}

// Function to upload CSV data to Google Sheets
async function uploadCSVToSpreadsheet(auth, csvFilePath) {
    const sheets = google.sheets({ version: 'v4', auth });
    const stream = fs.createReadStream(csvFilePath, { encoding: 'utf-8' });
    const rl = require('readline').createInterface({
        input: stream,
        terminal: false
    });

    let rows = [];
    let currentRowCount = 0;

    for await (const line of rl) {
        const values = line.split(',');
        if (currentRowCount < BATCH_SIZE) {
            rows.push(values);
            currentRowCount++;
        }
        else {
            await processBatch(sheets, rows);
            rows = [];
            currentRowCount = 0;
        }
    }
    if (currentRowCount) {
        await processBatch(sheets, rows)
    }

}

// Main function to run the program
async function run() {
    try {
        const auth = await authenticateGoogleSheetsAPI();
        const csvFilePath = '/Users/ayushgupta/Documents/export.csv'; // Replace with your CSV file path
        await uploadCSVToSpreadsheet(auth, csvFilePath);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Execute the main function
run();