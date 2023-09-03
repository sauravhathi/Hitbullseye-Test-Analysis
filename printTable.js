function printTable() {
    const analysisDiv = document.querySelector("#analysisDiv");

    if (analysisDiv) {
        analysisDiv.style.width = "100%";
        analysisDiv.style.margin = "auto";
        const currentTestName = localStorage.getItem("currentTestName");
        const style = 'text-align: center; margin-top: 10px; margin-bottom: 10px;';

        const socialLinks = document.createElement("div");
        socialLinks.style = style;
        socialLinks.innerHTML = `
            <a href="https://bit.ly/3sEXO8h" target="_blank">YouTube</a>
            <a href="https://bit.ly/sauravhathi" target="_blank">GitHub</a>
            <a href="https://bit.ly/3R6hUSR" target="_blank">LinkedIn</a>
            <a href="https://bit.ly/faq-tel" target="_blank">Telegram</a>
        `;

        const testNameElement = document.createElement("h2");
        testNameElement.textContent = currentTestName;
        testNameElement.style = style;

        analysisDiv.insertAdjacentElement("afterbegin", testNameElement);
        analysisDiv.insertAdjacentElement("afterbegin", socialLinks);

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
        socialLinks.remove();
        testNameElement.remove();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
}