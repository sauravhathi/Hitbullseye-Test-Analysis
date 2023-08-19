console.log('👨‍💻 Author: Saurav Hathi \n🌟 GitHub: https://github.com/sauravhathi');

const API_BASE_URL = "https://studentdashboardapis.hitbullseye.com/api/Bulldash";
const MENU_FETCH_URL = `${API_BASE_URL}/GeTestMenus`;
const TESTS_FETCH_URL = `${API_BASE_URL}/GetTestsList`;
const QUESTION_ANALYSIS_URL = `${API_BASE_URL}/bulldash_questionwiseanalysis`;

async function fetchData(url, requestBody, headers) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        handleFetchError(error);
    }
}

function handleFetchError(error) {
    if (error.message.includes("Unexpected end of JSON input")) {
        alert("Please attempt the test first.");
        return;
    }

    console.log("Error fetching data:", error);
    throw error;
}

async function fetchMenuData() {
    const menuDataReq = { clickedmenuid: "26" };
    const headers = {
        accept: "application/json, text/plain, */*",
        authorization: "Bearer " + localStorage.getItem("token"),
        "content-type": "application/json;charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Origin: "https://student.hitbullseye.com",
        Referer: "https://student.hitbullseye.com/testzone/tests-menus;title=TestCategories",
    };
    return await fetchData(MENU_FETCH_URL, menuDataReq, headers);
}

async function fetchTests(selectedMenuId) {
    const reqBody = {
        menuid: selectedMenuId,
        testsorting: "0",
        testdatesorting: "0",
        teststatus: "0",
        search: "",
    };
    const headers = {
        accept: "application/json, text/plain, */*",
        "content-type": "application/json;charset=UTF-8",
        Origin: "https://student.hitbullseye.com",
        Referer: "https://student.hitbullseye.com/testzone/tests-menus;title=TestCategories",
        authorization: "Bearer " + localStorage.getItem("token"),
    };
    return await fetchData(TESTS_FETCH_URL, reqBody, headers);
}

async function fetchQuestionWiseAnalysis(selectedTestId) {
    const reqBody = { testid: selectedTestId };
    const headers = {
        accept: "application/json, text/plain, */*",
        authorization: "Bearer " + localStorage.getItem("token"),
        "content-type": "application/json;charset=UTF-8",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        Origin: "https://student.hitbullseye.com",
        Referer: "https://student.hitbullseye.com/testzone/question-wise-analysis",
    };
    return await fetchData(QUESTION_ANALYSIS_URL, reqBody, headers);
}

function createSelectElement(options, onChangeCallback) {
    const selectElement = document.createElement("select");
    options.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        selectElement.appendChild(optionElement);
    });
    selectElement.addEventListener("change", onChangeCallback);
    return selectElement;
}

function createAnalysisTable(analysisData) {
    const parentTestDiv = document.createElement("div");
    const printButton = document.createElement("button");
    printButton.textContent = "Print";
    printButton.classList.add("print-button");
    printButton.addEventListener("click", printTable);
    parentTestDiv.classList.add("table-container");
    parentTestDiv.style.maxWidth = "300px";
    parentTestDiv.style.overflowWrap = "break-word";
    parentTestDiv.style.marginTop = "5px";
    parentTestDiv.style.marginBottom = "5px";

    const tableElement = document.createElement("table");
    tableElement.classList.add("analysis-table");
    const pElement = document.createElement("p");
    pElement.innerHTML = "Correct Answers: ";
    tableElement.innerHTML = "<tr><th>Question Number</th><th>Correct Answer</th></tr>";

    if (!analysisData) {
        return parentTestDiv;
    }

    analysisData.forEach((question) => {
        pElement.innerHTML += question.Correct_Answer;
        const rowElement = document.createElement("tr");
        rowElement.innerHTML = `<td>${question.Qnumber}</td><td>${question.Correct_Answer}</td>`;
        tableElement.appendChild(rowElement);
    });

    parentTestDiv.appendChild(pElement);
    parentTestDiv.appendChild(printButton);
    parentTestDiv.appendChild(tableElement);

    return parentTestDiv;
}

function printTable() {
    const analysisDiv = document.querySelector("#analysisDiv");

    if (analysisDiv) {
        analysisDiv.style.width = "100%";
        analysisDiv.style.margin = "auto";
        const currentTestName = localStorage.getItem("currentTestName");
        const testNameElement = document.createElement("h2");
        testNameElement.textContent = currentTestName;
        testNameElement.style.textAlign = "center";
        testNameElement.style.marginTop = "10px";
        testNameElement.style.marginBottom = "10px";
        analysisDiv.insertAdjacentElement("afterbegin", testNameElement);
        const contentToPrint = analysisDiv.outerHTML;
        const printWindow = window.open("", "_blank");
        const watermarkText = 'https://github.com/sauravhathi';
        const watermarkStyle = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 40px;
            color: rgba(0, 0, 0, 0.15);
            z-index: 9999;
            pointer-events: none;
        `;
        const watermarkTag = `<div style="${watermarkStyle}" data-watermark>${watermarkText}</div>`;
        printWindow.document.write(`
            <title>${"Answer Key - " + currentTestName + " - @sauravhathi"}</title>
            <style>
                @media print {
                    div[data-watermark] {
                        display: block !important;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 40px;
                        color: rgba(0, 0, 0, 0.15);
                        z-index: 9999;
                        pointer-events: none;
                    }
                    .print-button {
                        display: none;
                    }
                }
            </style>
       `);

        printWindow.document.write(contentToPrint);
        printWindow.document.body.insertAdjacentHTML('beforeend', watermarkTag);
        printWindow.document.close();
        testNameElement.remove();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
}


function createCloseButton() {
    const credit_button = document.createElement("div");
    credit_button.classList.add("credit-button");
    const credit_p = document.createElement("p");
    credit_p.classList.add("credit-p");
    credit_p.textContent = "Code by Saurav Hathi";
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-button");
    closeButton.textContent = "🔥";
    closeButton.title = "Close";
    closeButton.addEventListener("click", () => {
        const contentContainer = document.querySelector(".content_container");
        if (contentContainer) {
            contentContainer.remove();
        }
    });
    credit_button.appendChild(credit_p);
    credit_button.appendChild(closeButton);
    return credit_button;
}

async function executeFlow() {
    try {
        const testSelect = createSelectElement([{ value: "", text: "Select a Test" }], onTestSelectChange);
        testSelect.id = "testSelect";

        const menuData = await fetchMenuData();
        console.log("Fetching menu data...");
        const menuOptions = menuData.map((menuItem) => ({
            value: menuItem.menuid,
            text: menuItem.menutitle,
        }));
        const menuSelect = createSelectElement(menuOptions, onMenuSelectChange);

        const div = document.createElement("div");
        div.classList.add("content_container");
        document.body.appendChild(div);

        const closeButton = createCloseButton();
        div.appendChild(closeButton);

        div.appendChild(document.createTextNode("Select a Menu: "));
        div.appendChild(menuSelect);
        div.appendChild(document.createElement("br"));
        div.appendChild(document.createTextNode("Select a Test: "));
        const parentTestDiv = document.createElement("div");
        parentTestDiv.classList.add("parent-test-div");
        parentTestDiv.appendChild(testSelect);
        div.appendChild(parentTestDiv);
    } catch (error) {
        handleFetchError(error);
    }
}

function onMenuSelectChange() {
    const selectedMenuId = this.value;
    fetchTests(selectedMenuId)
        .then((tests) => {
            console.log("Fetching tests...");
            const testOptions = tests.map((test) => ({ value: test.testid, text: test.testname }));
            localStorage.setItem("testOptions", JSON.stringify(testOptions));

            testSelect.innerHTML = "";
            const initialOption = document.createElement("option");
            initialOption.value = "";
            initialOption.textContent = "Select a Test";
            testSelect.appendChild(initialOption);
            testOptions.forEach((testOption) => {
                const optionElement = document.createElement("option");
                optionElement.value = testOption.value;
                optionElement.textContent = testOption.text;
                testSelect.appendChild(optionElement);
            });
        })
        .catch((error) => {
            handleFetchError(error);
        });
}

function onTestSelectChange() {
    const selectedTestId = this.value;

    if (!selectedTestId) {
        const analysisDiv = document.querySelector("#analysisDiv");
        if (analysisDiv) {
            analysisDiv.remove();
        }
        return;
    }

    const testOptions = JSON.parse(localStorage.getItem("testOptions"));
    const selectedTest = testOptions.find((test) => test.value === parseInt(selectedTestId));
    localStorage.setItem("currentTestName", selectedTest.text);

    fetchQuestionWiseAnalysis(selectedTestId)
        .then((questionWiseAnalysis) => {
            console.log("Fetching question-wise analysis...");
            const analysisDiv = document.querySelector("#analysisDiv");
            if (analysisDiv) {
                analysisDiv.remove();
            }

            const newAnalysisTable = createAnalysisTable(questionWiseAnalysis);
            newAnalysisTable.id = "analysisDiv";

            const div = document.querySelector(".parent-test-div");
            div.appendChild(newAnalysisTable);
        })
        .catch((error) => {
            handleFetchError(error);
        });
}

if (window.location.href.includes("https://student.hitbullseye.com/testzone")) {
    executeFlow();
}