```` javascript
#### Installing
To install `travel-itinerary`, you can use npm:

	npm i travel-itinerary
#### Install dependencies
Before using `travel-itinerary`, you need to ensure that you have the following dependencies installed in your project:

     npm install react react-dom 
     npm install react-leaflet

#### About
`travel-itinerary` is a React library designed to support geolocation-related planning within web applications. It uses the `react-leaflet` library to generate interactive maps for users, allowing them to drop markers or input locations to plan trips or geo-planning activities. Key features include:
-   Generation of a polyline to display the path from the origin to the destination.
-   Visualization of elevation data through a chart, showing the elevation of both the origin and destination points.

#### ViewMap Component:
This component renders the map using `react-leaflet` and shows the markers, polyline and the elevation based on provided data.
##### Usage:

	import  React  from  'react'; 
	import {Loader} from 'semantic-ui-react';
	import { ViewMap } from  'travel-itinerary';
	import markerIcon from "./markerIcon.png"; 
	const mapStyle ={
	width : "100%",
	}
	const App = () =>{
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
		export default App;
	
#### InteractiveMap Component:
This component renders the map using `react-leaflet` and asks the users to drop the data for the origin and destination and then generates the polyline using Api used within.
##### Usage:

	import  React  from  'react'; 
	import { InteractiveMap , EditForm, ElevationInfo } from  'travel-itinerary';
	const mapStyle ={
	width : "100%",
	}
	const App = () =>{
	const [formData , setFormData ] = useState('');
	const loader = <Loader active /> //For Semantic UI loader
	return(
	<div>
	<InteractiveMap
	data={formData}
	setData={setFormData}
	mapConfig={{
	url:  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	attribution:
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
	export default App;

#### TravelMapComponent 
This component works similarly as the above `InteractiveMap` Component and the only difference being not importing 3 different components.
	
	import TravelMap from  'travel-itinerary';
	const mapStyle ={
	width : "100%",
	}
	const App = () =>{
	const [formData , setFormData ] = useState('');
	const loader = <Loader active /> //For Semantic UI loader
	return(
	<div>
	<TravelMap
	data={formData}
	setData={setFormData}
	mapConfig={{
	url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	attribution:
	'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
	export default App;

#### ElevationChart Component
This component uses the `c3.js` library to generate and display an elevation chart of origin destination to the user.
##### Usage
	import  React  from  'react'; 
	import { ElevationChart} from  'travel-itinerary';
	import bg from "../assets/bg.png";
	const App = () =>{
	const chartData = [ {
	day : 1,
	label : "KTM",
	elevation:"2234m",
	},
	{
	day : 2,
	label : "Pokhara",
	elevation:"1658m",
	} ,
	...
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
	export default App;

#### GetData Component
It generates an textarea field that contains all the data so that users can copy paste it for their usage.
##### Usage
	import { useState } from  "react";
	import { GetData } from  "travel-itinerary"; 
	function  App() {
	const [formData, setFormData] =  useState();
	return (
	<div>
	<GetData  data={formData}  />
	</div>
	);
	}
	export  default  App;
````
