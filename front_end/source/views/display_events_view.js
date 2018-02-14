const MapWrapper = require('../services/mapWrapper.js');

const DisplayEvents = function(){

}

DisplayEvents.prototype.renderInternal = function (incomingEvents) {
  let events = removeEventsBeforeToday(incomingEvents);
  this.createInternalEventsTable(events);
};

DisplayEvents.prototype.renderExternal = function (incomingApiInfo) {
  let info = incomingApiInfo;
  this.createExternalEventsTable(info);
};

DisplayEvents.prototype.createTable = function(col1, col2, col3, col4){
  const table = document.createElement('table');
  let tabletitles =document.createElement('tr');
  let tabletitle1 = document.createElement('th');
  let tabletitle2 = document.createElement('th');
  let tabletitle3 = document.createElement('th');
  let tabletitle4 = document.createElement('th');
  tabletitle1.innerText = col1;
  tabletitle2.innerText = col2;
  tabletitle3.innerText = col3;
  tabletitle4.innerText = col4;

  tabletitles.appendChild(tabletitle1);
  tabletitles.appendChild(tabletitle2);
  tabletitles.appendChild(tabletitle3);
  tabletitles.appendChild(tabletitle4);
  table.appendChild(tabletitles);
  return table;
}


DisplayEvents.prototype.createInternalEventsTable = function(events){
  const target = document.querySelector('.internalinfo');
  let table = this.createTable("Day", "Event", "Organiser", "Time")
  table = this.populateInternalTable(table, events);
  target.appendChild(table);
}


DisplayEvents.prototype.populateInternalTable = function(table, events){
  events.forEach(function(event){
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let a = document.createElement('a');
    let a1 = document.createElement('a');

    a.href = event.title_url;
    a.target = "_blank"
    a.innerHTML = `${event.title_type} : ${event.title}`;
    td2.appendChild(a);
    td1.innerText = event.day
    a1.href = event.organiser_email;
    a1.innerHTML = `${event.organiser}`;
    td3.appendChild(a1);

    td4.innerText = event.total_time;
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    table.appendChild(tr);
  });
  return table;
}

DisplayEvents.prototype.createExternalEventsTable = function(info){
  const target = document.querySelector('.techinfo');

  let table = this.createTable("Day", "Event", "Venue", "Time")

  for (counter = 0; counter < 8; counter++){

    let tableRow = document.createElement('tr');
    let dateData = document.createElement('td');
    let titleData = document.createElement('td');
    let venueData = document.createElement('td');
    let timeData = document.createElement('td');
    let titleAnchor = document.createElement('a');

    let date = info[counter].start.rfc2882local;
    let choppedDate = date.substring(0, 12);

    let title = info[counter].summaryDisplay;
    let choppedTitle = title.substring(0, titleChop(title));

    let venueInfo = this.getVenueInfo(info);
    let venueButton = this.createVenueButton(venueInfo);

    let totalTime = this.formatTime(info)

    dateData.innerText = choppedDate;
    titleAnchor.href = info[counter].siteurl;
    titleAnchor.target = "_blank"
    titleAnchor.innerHTML = choppedTitle;
    titleData.appendChild(titleAnchor);
    venueData.appendChild(venueButton);
    timeData.innerText = totalTime;
    tableRow.appendChild(dateData);
    tableRow.appendChild(titleData);
    tableRow.appendChild(venueData);
    tableRow.appendChild(timeData);



    table.appendChild(tableRow);
  }
  target.appendChild(table);
}

DisplayEvents.prototype.createVenueButton = function(venueInfo) {
  const venueButton = document.createElement('button');
  venueButton.id = "table_button"
  venueButton.innerText = venueInfo.location;
  venueButton.addEventListener('click', this.venuePopUp);
  if (venueInfo.location === "TBA"){
    venueButton.disabled = 'true';
  }
  venueButton.valuevenue= venueInfo.location;
  venueButton.valueLat =venueInfo.latitude;
  venueButton.valueLng =venueInfo.longitude;
  return venueButton;
};

DisplayEvents.prototype.getVenueInfo = function(info){
  let venue;
  let venuelat;
  let venuelng;
  try{
    const venueFullName = info[counter].venue.title
    venue = venueFullName.substring(0, venuechop(venueFullName));
    venuelat = info[counter].venue.lat;
    venuelng = info[counter].venue.lng;
  }
  catch(e){
    venue ="TBA";
    venuelat = null;
    venuelng = null;
  }
  return venueDetails = { location: venue, latitude: venuelat, longitude: venuelng};
}

DisplayEvents.prototype.formatTime = function(info){
  let timestart = info[counter].start.hourtimezone + ":" + info[counter].start.minutetimezone;
  let timeend = info[counter].end.hourtimezone + ":" + info[counter].end.minutetimezone;
  let totaltime = `${timestart} - ${timeend}`;
  return totaltime;
}

DisplayEvents.prototype.venuePopUp = function(){
  let mapPopupDiv = document.querySelector("#mappopup_bg");
  let mapDiv = document.querySelector('#mapPopUpMain');
  mapPopupDiv.style.display = 'block';
  let incomingVenue = this.valuevenue;
  let incomingLat = this.valueLat;
  let incomingLng = this.valueLng;


  mapDiv.innerText = "This event does not have a venue yet :("
  let latNum = Number(incomingLat);
  let lngNum = Number(incomingLng);
  let center = { lat: latNum, lng: lngNum };
  let mainMap = new MapWrapper(mapDiv, center, 16);
  let bubble =mainMap.addMarker(center);
  mainMap.addInfoBubble(bubble, incomingVenue);

}

let titleChop = function(string){
  if (string.indexOf(":") == -1) {
    return string.length}
    else {
      return string.indexOf(":");
    }
  };

  let venuechop = function(string){
    if (string.indexOf(",") == -1) {
      return string.length}
      else {
        return string.indexOf(",");
      }
    };

    let removeEventsBeforeToday = function(events){
      var returnedEvents = [];
      var now = new Date();
      events.forEach(function(event){
        if (event.end_time > now){
          returnedEvents.push(event)
        }
      })
      return returnedEvents;
    }

    module.exports = DisplayEvents;
