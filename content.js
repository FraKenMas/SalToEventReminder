if (document.readyState !== 'loading') {
  console.log("document alreay ready, code RUN");
  displayButton();
} else {
  document.addEventListener('DOMContentLoaded', function() {
    console.log("document was not ready");
    displayButton();
  });
}

function displayButton() {

  console.log("DISPLAY THE MF BUTTON!")
  
  let date = "";
  let title = "";
  let subtitle = "";
  let description = "";

  const dateElem = document.querySelector("h6.date");
  if (dateElem) {
    date = dateElem.innerText.trim();
  }

  const titleElem = document.querySelector("h3.title");
  if (titleElem) {
    title = titleElem.innerText.trim();
  }

  const subtitleElem = document.querySelector("h4.subtitle");
  if (subtitleElem) {
    subtitle = subtitleElem.innerText.trim();
  }

  //TODO implementare unione tra descrizione e location (location no geolocalizzata, riportare solo testo)

  const locationZoneElem = document.querySelector("h6.location-zone");
  if (locationZoneElem) {
    locationZone = locationZoneElem.innerText.trim();
  }

  const descriptionDiv = document.querySelector(".description");
  if (descriptionDiv) {
    description = descriptionDiv.querySelector('p').textContent;
  }

  console.log(date);
  console.log(title);
  console.log(subtitle);
  console.log(description);

  // Create the button element
  const floatButton = document.createElement("button");
  floatButton.id = "floatButton";
  floatButton.title = "Add to calendar";

  // Add the "+" icon to the button
  const plusIcon = document.createElement("i");
  plusIcon.className = "fa  fa-calendar-plus";
  floatButton.appendChild(plusIcon);

  // Add styles to the button
  floatButton.style.position = "fixed";
  floatButton.style.bottom = "20px";
  floatButton.style.right = "20px";
  floatButton.style.width = "50px";
  floatButton.style.height = "50px";
  floatButton.style.borderRadius = "50%";
  floatButton.style.backgroundColor = "#fabe0a";
  floatButton.style.borderColor = "transparent";
  floatButton.style.color = "#fff";
  floatButton.style.fontSize = "24px";
  floatButton.style.textAlign = "center";
  floatButton.style.lineHeight = "50px";

  // Append the button to the body of the page
  document.body.appendChild(floatButton);

  // add a click listener to the button to run your code
  floatButton.addEventListener("click", function() {

    console.log("BUTTON PRESS!")
    
    const baseUrl = 'http://www.google.com/calendar/render?';

          const queryParams = {
            action: 'TEMPLATE',
            text: title,
            dates: parseDateString(date),
            details: description,
            location: '',
            trp: 'false',
            sprop: '',
            sprop_name: ''
          };

          const queryString = Object.keys(queryParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');
          const url = baseUrl + queryString;

          console.log("url", url);

          window.open(url, '_blank');

  });

}

function parseDateString(dateString) {
  // Map Italian month names to their numerical representation
  const monthMap = {
    'gennaio': '01',
    'febbraio': '02',
    'marzo': '03',
    'aprile': '04',
    'maggio': '05',
    'giugno': '06',
    'luglio': '07',
    'agosto': '08',
    'settembre': '09',
    'ottobre': '10',
    'novembre': '11',
    'dicembre': '12',
  };

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Split the string into its constituent parts
  const [day, monthName] = dateString.split(',')[0].split(' ');
  const timeRange = dateString.split('Ore ')[1];

  // Parse the day and month into numerical values, using the current year
  const month = monthMap[monthName.toLowerCase()];
  const date = new Date(Date.parse(`${month} ${day}, ${currentYear}`));

  // Extract the hours and minutes from the time range
  let startHours, startMinutes, endHours, endMinutes;
  if (timeRange) {
    const match = timeRange.match(/(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})/);
    if (match) {
      [, startHours, startMinutes, endHours, endMinutes] = match;
    }
  }

  // Set the start and end times on the date object
  if (startHours && startMinutes) {
    date.setHours(parseInt(startHours));
    date.setMinutes(startMinutes);
  }

  // Format the date object as a string in the required format
  const startDateString = date.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  
  // Increment the date object to represent the end time
  if (endHours && endMinutes) {
    date.setHours(parseInt(endHours));
    date.setMinutes(endMinutes);
  }

  // Format the date object as a string in the required format
  const endDateString = date.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';

  return `${startDateString}/${endDateString}`;
}
