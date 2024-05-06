
# travel-itinerary
`travel-itinerary` is a React library designed to support geolocation-related planning within web applications. It uses the `react-leaflet` library to generate interactive maps for users, allowing them to drop markers or input locations to plan trips or geo-planning activities. 

## Features
- Generation of a polyline to display the path from the origin to the destination. 
-  Visualization of elevation data through a chart, showing the elevation of both the origin and destination points.

### Installation
To install `travel-itinerary`, you can use npm:
``` bash 
	npm i travel-itinerary
```

### Install dependencies
Before using `travel-itinerary`, you need to ensure that you have the following dependencies installed in your project:
``` bash
     npm install react react-dom 
     npm install react-leaflet
```
### Components
#### ViewMap Component:
This component renders the map using `react-leaflet` and shows the markers, polyline and the elevation based on provided data.
##### Usage:
```` javascript
import  React  from  'react'; 
import {Loader} from 'semantic-ui-react';
import { ViewMap } from  'travel-itinerary';
import markerIcon from "./markerIcon.png"; 

const mapStyle ={
   width : "100%",
}

const ViewComponent = () =>{
	const dummyData = {
		origin :"Kathmandu",
		destination:"Pokhara",
		origin_elevation: "2234m",
		destination_elevation: "1658m",
		origin_coordinates:[,],
		destination_coordinates: [,],
		encoded_polyline:""
		}
	const loader = <Loader active /> //For Semantic UI loader
	const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
	const attribution ='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
	
return(
	<div>
	<ViewMap 
	 	data={dummyData} 
		mapConfig ={{
		showElevation: true,  //default value is false
		url : url, 
		attribution: attribution,
		markerIcon : markerIcon,
		polylineColor : red,  //default value is green
		loader : loader , 
		zoom : "5"
		mapPosition : [27,87],
		}}
		mapStyle ={ mapStyle}
		 />
	</div>
);
}

export default ViewComponent;
````
#### InteractiveMap Component:
This component renders the map using `react-leaflet` and asks the users to drop the data for the origin and destination and then generates the polyline using Api used within.
##### Usage:
```` javascript
import  React  from  'react'; 
import { InteractiveMap , EditForm, ElevationInfo } from  'travel-itinerary';

const mapStyle ={
	width : "100%",
}

const MapComponent= () =>{
	const [formData , setFormData ] = useState('');
	const loader = <Loader active /> //For Semantic UI loader
	
return(
	<div>
	<InteractiveMap
		data={formData}
		setData={setFormData}
		mapConfig={{
		url:  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		markerIcon:  icon,
		markerSize: [30, 30],
		polylineColor:  "red",
		loader:  loader,
		zoom:  "5",
		mapPosition: [27.6938375, 85.3244753],
		}}
		mapStyle={mapStyle}
	>
		<EditForm  data={formData}  setData={setFormData}  />
		<ElevationInfo
			data={formData}
			setData={setFormData}
			elevationStyle={elevationStyle}
		/>
	</InteractiveMap>	
 	</div>
);
}

export default MapComponent;
````
#### TravelMapComponent 
This component works similarly as the above `InteractiveMap` Component and the only difference being not importing 3 different components.
```` javascript
import TravelMap from  'travel-itinerary';

const mapStyle ={
	width : "100%",
}

const TravelComponent = () =>{
	const [formData , setFormData ] = useState('');
	const loader = <Loader active /> //For Semantic UI loader
	
return(
	<div>
	<TravelMap
		data={formData}
		setData={setFormData}
		mapConfig={{
		url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		markerIcon: icon,
		markerSize: [30, 30],
		polylineColor: "red",
		loader: loader,
		zoom: "5",
		mapPosition: [27.6938375, 85.3244753],
		}}
		mapStyle={mapStyle}
	/>
	</div>
 );
}

export default TravelComponent ;
````
#### ElevationChart Component
This component uses the `c3.js` library to generate and display an elevation chart of origin destination to the user.
##### Usage
```` javascript
import  React  from  'react'; 
import { ElevationChart} from  'travel-itinerary';
import bg from "../assets/bg.png"; // Import your png file if u want background in chart

const ChartComponent = () => {
	const chartData = [
	{
		day : 1,
		label : "KTM",
		elevation:"2234m",
	},
	{
		day : 2,
		label : "Pokhara",
		elevation:"1658m",
	} 
	]
	const chartStyle = {
	height: "100px",
	width :"100px
	}
	const loader = <Loader active /> //For Semantic UI loader
	
return(
	<div>
	<ElevationChart 
		title={title}
		chartData={chartData} 
		backgroundImage={bg}
		chartColor= "red"
		chartStyle = {chartStyle}
		loader={loader}/>
	</div>
);
}

export default ChartComponent;
````
#### GetData Component
It generates a text area field that contains all the data so that users can copy paste it for their usage.
##### Usage
``` javascript
import { useState } from  "react";
import { GetData } from  "travel-itinerary"; 

const DataComponent = () => {
	const [formData, setFormData] =  useState();
	
return (
	<div>
	<GetData  data={formData}  />
	</div>
);
}

export  default  DataComponent ;
````

``` vbnet
This README provides clear instructions and examples for  using the `travel-itinerary` package. Feel free to adjust as needed!
```
