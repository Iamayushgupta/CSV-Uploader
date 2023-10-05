## Problem Statement:
Make a CSV Importer for Google Sheets that lets users drag and drop CSV files onto the Google Sheet. The moment they drop the CSV file, allow them to select which columns to import 🗂️.

## Approach to the Problem
The approach to this problem is that we can write the logic for getting the CSV file (i.e getting the input as a file) which when uploaded, directly gets appended to the current active spreadsheet. Now to implement the backend of the part, we can do it in two ways :- 
1. Utilize Google-APIs, via Nodejs OR Javascrip OR Python to write the code in the local where data can be read and dumped. We can upload the CSV file by specifying the spreadsheetID in which CSV has to be uploaded. Before uploading, we can for taking only specific columns too.
2. We can open a new Spreadsheet, Navigate to Extensions and Open Appscrips, we can create a new .gs file write the logic for uploading the data in the specified format.

## Google APIs 
Refer to the below documentation to connect Google-APIs smoothly with the spreadsheets
```
https://www.notion.so/Uploading-CSV-file-to-Google-Spreadsheet-66758525d4ac41198944f980e2d7da4c
```

## Steps to run the code
1. Create a new Folder
2. Download the project files 
   ```
   git clone git@github.com:Iamayushgupta/CSV-Uploader.git
   ```
3. Install npm package manager 
   ```
   npm init -y
   ```
4. Install the dependencies
    ```
    npm install
    ```
5. Create a new Spreadsheet and add it's ID in the code
      <img width="835" alt="image" src="https://github.com/Iamayushgupta/CSV-Uploader/assets/73697731/52c035f4-ba2c-4e8d-bda6-589fa91e69cd">
      <hr>
  

6. Create credentials.json and after authentication token.json will be dowloaded to access refresh token
      <img width="283" alt="image" src="https://github.com/Iamayushgupta/CSV-Uploader/assets/73697731/fa005129-503b-40e4-8c62-f140b79bcb8f">
      <hr>

7. Put the CSV file path which you want to be added
      <img width="762" alt="image" src="https://github.com/Iamayushgupta/CSV-Uploader/assets/73697731/f9897f68-becc-4036-9023-d8c76e0ce821">
      <hr>
