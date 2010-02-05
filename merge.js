// MERGE merges s3db operator states 
// Syntax: state=merge(states)
// Description: This function takes in alphabetic indexes for recessive (lower case)
//              and dominant (upper case) states. The states can be an Array of states
//              or a comma delimited string. It also accept multiple states, that is,
//              more than one index in each element of the array, or between commas.
//
// Note: console.log commands will report progress back to console if active, 
//       for example, in Firefox, using the firebug addon.
//
// Examples: merge("b,c,C,D") -> "C";  merge("b,cd,Ca,DcA") -> "CdA"
//           merge(["b","cd","Ca","DcA"]) -> "CdA"
//           in the last two examples the console, if active, would show:
//
//              merge("b,c,C,D")="C"
//              merge("-,d,a,c")="d"
//              merge("-,-,-,A")="A"
//
// Jonas Almeida Dec 2009


function merge(x) {
	//parse states
	if (typeof(x)==="string") {var xx=x.split(",")} // parse string into array of states
	else {var xx=x} // in case x was already an array with parsed states
	//Find out maximum size, n, of all states
	var n = 0;
	var m = 0;
	for (var i=0; i<xx.length; i++) {
		if (xx[i].length>n) {n=xx[i].length};
		}
	if (n>1) { // if multiple states solve one at a time
		for (var i=0; i<xx.length; i++) { // add blank states if missing
			for (var j=xx[i].length; j<n; j++) {
				xx[i]+="-";				
			}
		}
		z = new Array; // singular states collected here, to solve one at a time
		y = new Array; // merged states collected here;
		for (var j=0; j<n; j++) {
			for (var i=0; i<xx.length; i++) {z[i]=xx[i].slice(j,j+1)}
			y[j]= merge(z);
			//console.log("merge("+z+")="+y[j]);
		}
	}
	else { // Equation 2 in the manuscript
		// Dominant
		var D = new Array; // collect indexes of dominant states here
		var R = new Array; // collect indexes of recessive states here
		var y = new String; // merged state collected here
		for (var i=0; i<xx.length; i++) {
			if (xx[i].toUpperCase()===xx[i]) {if (xx[i]!=="-") {D[D.length]=xx[i]}}
			else {R[R.length]=xx[i]}
		}
		if (D.length>0) { // if there are dominant states take its minimum value
			D = D.sort();y = D[0];
		}
		else { // otherwise take maximum of recessive (lower case index) state
			if (R.length>0) {R = R.sort();y = R[R.length-1]}
		}
		if (y.length==0) {y="-"}; // the null state is assigned to the abcense of states
	}
	
	if (typeof(y)!=="string") { // convert array to string
		y=y.join("")
	} 

	return y;	
}

//console.log("merge.js loaded")
