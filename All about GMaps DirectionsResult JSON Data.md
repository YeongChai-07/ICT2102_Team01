Some details about GMaps DirectionsResult JSON Data:
========================================================
response.routes[] => a list of available routes to destination
response.routes[n].legs[0] 
=> Shows a list of information about the route
	- steps (instructional steps)
	- start_address(source of where you are)
	- end_address(your destination),
    - arrival_time (time you arrive at the destination)
	- departure_time (time you move off from source to the destination)
	- duration (TOTAL time spent travel from source to destination)
	
response.routes[n].legs[0].steps[n]
=> Shows a information about that particular (single) steps
	- instructions (instructional details about the current step)
	- travel_mode (mode of travel, possible modes "TRANSIT, WALKING")
	- steps (sub-attribute => ONLY available in "WALKING" travel_mode)
	- transit (ONLY available in "TRANSIT" travel_mode)
	- distance
	- duration
	
FOR WALKING ONLY:
response.routes[n].legs[0].steps[n].steps[n]
=> shows information about that particular (single) step of the walk
	- instructions (steps of the DIRECTION to walk)
	- distance
	- duration
	
FOR TRANSIT:
response.routes[n].legs[0].steps[n].transit
	- arrival_stop
	- arrival_time
	- departure_stop
	- departure_time
	- headsign (example "TO DHOBY GHAUT")
	- line (explained below)
	- num_stops (INTEGER => number of stops)

response.routes[n].legs[0].steps[n].transit.line
		- short_name 
			1. For Trains e.g. NS, CC
			2. For Bus (Bus service No.) e.g. 55, 53, 87
		- name (FULL Train Service Name example: Circle Line, North South Line)
		- color (TRAIN-EXCLUSIVE, Service Icon color)
		- text_color (TRAIN-EXCLUSIVE, Service Icon text color)
		- vehicle (The transit service vehicle details)

response.routes[n].legs[0].steps[n].transit.line.vehicle
	- icon (Google's icon to represent the service type, in .PNG)
	- name ([NORMAL-Casing] about the service )
	- type ([CAPS-Casing] about the service in )
