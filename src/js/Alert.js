class Alert {
    constructor() {
        this.alerts = []; // Initialize alerts array
        this.getData(); // Call getData method to fetch alerts
       
    }

    async getData() {
        try {
            const response = await fetch(`https://raw.githubusercontent.com/EzequielTartaglia/WDD-330-BYU/main/src/json/alerts.json`);
            if (!response.ok) {
                throw new Error('Failed to fetch alerts');
            }
            //console.log(this.alerts)
            this.alerts = await response.json();
            this.displayAlerts(); 
        } catch (error) {
            //console.error('Error fetching alerts:', error);
        }
    }

    displayAlerts() {
        const mainElement = document.querySelector('main');
        const alertSection = document.createElement('section');
        alertSection.classList.add('alert-list');

        this.alerts.forEach(alert => {
            const alertParagraph = document.createElement('p');
            alertParagraph.textContent = alert.message;
            alertParagraph.style.backgroundColor = alert.background;
            alertParagraph.style.color = alert.color;
            alertSection.appendChild(alertParagraph);
        });

        mainElement.prepend(alertSection);
    }
}

export default Alert;