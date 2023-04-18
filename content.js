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
  
  let date = "";
  let title = "";
  let subtitle = "";
  let description = "";
  let locationZone = "";
  const currentUrl = window.location.href;

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

  const locationZoneElem = document.querySelector(".location-zone");
  if (locationZoneElem) {
    locationZone = locationZoneElem.textContent.trim();
  }

  const descriptionDiv = document.querySelector(".description");
  if (descriptionDiv) {
    const pDescription = descriptionDiv.querySelectorAll('p');
    description = Array.from(pDescription).map(p => p.textContent).join('\n');
  }

  const eventDescription = title && subtitle ? title + " - " + subtitle : title;

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
  floatButton.style.bottom = "10px";
  floatButton.style.right = "10px";
  floatButton.style.width = "48px";
  floatButton.style.height = "48px";
  floatButton.style.borderRadius = "50%";
  floatButton.style.backgroundColor = "#fabe0a";
  floatButton.style.borderColor = "transparent";
  floatButton.style.color = "#fff";
  floatButton.style.fontSize = "24px";
  floatButton.style.textAlign = "center";
  floatButton.style.lineHeight = "44px";

  // Append the button to the body of the page
  document.body.appendChild(floatButton);

  // add a click listener to the button to run your code
  floatButton.addEventListener("click", function() {
    
    const baseUrl = 'http://www.google.com/calendar/render?';

          const queryParams = {
            action: 'TEMPLATE',
            text: eventDescription,
            dates: parseDateString(date),
            details: description + "\n\nLink all'evento: " + currentUrl,
            location: locationZone,
            trp: 'false',
          };

          const queryString = Object.keys(queryParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');
          const url = baseUrl + queryString;

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