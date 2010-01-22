// PERCOLATE finds steady state solution for the propagation of s3db operator states
//
//
//
// Syntax: child_state=migrate(parent_state,m,g)
// Description: migrates s3db operator states between a parent and its child
//              entities, as described by Equation 6. The function has two 
//              additional, optional, input arguments to set the state's length,m,
//              and the number of generations, g, i.e. consecutive migrations
//              to be calculated.
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

console.log('percolate.js loaded');

function percolate(T,E) {// Equation 7, which is the steady state Solution to Equation 4
    return false;	
}

percolate.GUI = function (div,T,S) {// create GUI within target div element
	// T is either the transition matrix or the number of entities
	// Identify div
	console.log('percolateGUI called');
	if (!div) {var div = document.getElementById('percolateDiv')}
	if (typeof(div)=="string") {div = document.getElementById(div)} // in case the div provided is div's id
	// Identify T
	if (parseInt(T)==T) { // if T is an integer specifying the dimensionality of the transition matrix
		var n=T;T=percolate.createT(T);
	}
	percolate.T=T; // note the transition matrix is being kept as an attribute of the object
	div.innerHTML="<table><tr><td>Transition matrix</td><td>States</td></tr><tr><td id=transition></td><td id=states></td></tr>";
	document.getElementById('transition').appendChild(percolate.tableT(T));
	if (!S) {S=percolate.createS()}
	percolate.S=S;
	document.getElementById('states').appendChild(percolate.tableS0(S));
	return false
}

percolate.createT = function (n) {// create a n x n square matriz of zeros
    var T = new Array;
	for (var i=0; i<n; i++) {
		T[i] = new Array;
		for (var j=0; j<n; j++) {
			T[i][j]=0;
		}
	}
	return T;	
}

percolate.createS = function (n) {// create a 1 x n vector of native states (notice teh transposition with regard to regular external product
	if (!n&!!percolate.T) {n=percolate.T.length}
    var S = new Array;
	S[0] = new Array;
	for (var i=0; i<n; i++) {
		S[0][i]="-";
	}	
	return S;	
}


percolate.tableT = function (T) {// create input table for values of T
	if (!T) {T=percolate.T}
    var tb = document.createElement('table');
	var tbody = document.createElement('tbody');
	tb.appendChild(tbody);
	for (var i in T) {
		var tr = document.createElement('tr');
		tbody.appendChild(tr);
		for (var j in T[i]) {
			//console.log(T[i][j])
			var td = document.createElement('td');
			td.innerHTML="<input size=1 value="+T[i][j]+">";	
			tr.appendChild(td);
		}
		// Native State
	}
	return tb;	
}

percolate.tableS0 = function (S) {// create input table for initial values of S
	if (!S) {S=percolate.S}
    var tb = document.createElement('table');
	var tbody = document.createElement('tbody');
	tb.appendChild(tbody);
	for (var i in S[0]) { // first row contains native state
		var tr = document.createElement('tr');
		tbody.appendChild(tr);
		var td = document.createElement('td');
		td.innerHTML="<input size=5 value="+S[0][i]+">";	
		tr.appendChild(td);
	}
	return tb;	
}