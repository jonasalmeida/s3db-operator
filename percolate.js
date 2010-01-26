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


function percolate(T,S,m) {// EQUATION 7, which is the steady state Solution to Equation 4, below
	if(!T){T=percolate.T}; // transition matrix, T
	if(!S) {S=percolate.S}; // States, S, of model entities E
	if(!m) {if (!percolate.m) {percolate.m=1} ; m=percolate.m}; // number of operators
	S = [S[0]]; // reboot percolation
	var stable = 1;
	for (var i=1; i<100; i++) {
		S[i] = percolate.iterate(T,S[i-1],m);
		// check if stable solution reached
		stable=1;
		for (var j=0; j<S[i].length; j++) {stable=stable*(S[i][j]===S[i-1][j])};
		if (stable) {break};
		// maximum num of iterations
		if (i>10) {break}; 
	}	
    return S;	
}

percolate.iterate = function (T,Sx,m) { // EQUATION 4: Sy = T x Sx , m = number of operators
	if (!m) {m=1}; // default is one operator
	var Sy = new Array;
	for (var i=0; i<Sx.length; i++) {
		var Si = new Array;
		Si[0]=Sx[i]; // the state currently native to the ith entity
		for (var j=0; j<T[i].length; j++) {
			if (T[i][j]===1) {Si[Si.length]=migrate(Sx[j],m)}
		}
		Sy[i]=merge(Si);
	}
	return Sy;
}


percolate.GUI = function (div,T,S) {// create GUI within target div element
	// T is either the transition matrix or the number of entities
	// Identify div
	//console.log('percolateGUI called');
	if (!div) {var div = document.getElementById('percolateDiv')}
	if (typeof(div)=="string") {div = document.getElementById(div)} // in case the div provided is div's id
	// Identify T
	if (parseInt(T)==T) { // if T is an integer specifying the dimensionality of the transition matrix
		var n=parseInt(T);percolate.n=n;T=percolate.createT(n);
	}
	percolate.T=T; // note the transition matrix is being kept as an attribute of the object
	div.innerHTML="<table><tr><td>Transition matrix<br>(Bolean)</td><td>Assigned States<br>(alphabetic indexes)</td><td>Effective States<br>(solved using Eq. 7)</td><td>Percolation of States<br>(iterated Eq. 4)</td></tr><tr><td id=transition></td><td id=states></td><td id=effective_states></td><td id=percolated_states></td></tr>";
	document.getElementById('transition').appendChild(percolate.tableT(T));
	if (!S) {S=percolate.createS()}
	percolate.S=S;
	document.getElementById('states').appendChild(percolate.tableS0(S));
	var bt = document.createElement('input');
	bt.id='runPercolate';
	bt.type='button';
	bt.value="Run";
	bt.onclick=percolate.runGUI;
	div.appendChild(bt);
	return false
}

percolate.runGUI = function () {// run percolation as defined by GUI
	// capture T, S and m
	percolate.m=parseInt(document.getElementById("numOfOperatorsPercolating").value);
	var T = percolate.T;var S = percolate.S;var n = T.length;var Tij=0;
	for (var i=0; i<n; i++) {
		S[0][i]=document.getElementById("S_"+i).value;
		for (var j=0; j<n; j++) {
			Tij = document.getElementById("T_"+i+"_"+j).value;
			if (Tij!=="0") { // make sure T is Bolean: if it is not 0 then it is 1
				Tij=1;
				document.getElementById("T_"+i+"_"+j).value=1;
				T[i][j]=Tij;
			}
		}
	}
	percolate.T=T;
	percolate.S=[S[0]];
	percolate.S=percolate();
	// display percolated states
	percolate.remove_element_by_id("percolatedStatesTable"); // first remove table if it exists
	document.getElementById("percolated_states").appendChild(percolate.tableSs());
	// display effective states
	percolate.remove_element_by_id("effectiveState")
	document.getElementById("effective_states").appendChild(percolate.tableSf());

	return false;
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

percolate.s3dbT = function () { // fills S3DB transition matrix in GUI table
	document.getElementById("numOfOperatorsPercolating").value=3;
	document.getElementById('numOfEntities').value=7;
	document.getElementById('T_1_0').value=1;
	document.getElementById('T_2_1').value=1;
	document.getElementById('T_3_1').value=1;
	document.getElementById('T_3_2').value=1;
	document.getElementById('T_3_4').value=1;
	document.getElementById('T_4_2').value=1;
	document.getElementById('T_5_3').value=1;
	document.getElementById('T_5_4').value=1;
	document.getElementById('T_6_0').value=1;
	document.getElementById('T_6_6').value=1;	
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
			td.innerHTML="<input id='T_"+i+"_"+j+"' size=1 value="+T[i][j]+">";	
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
		td.innerHTML="<input id='S_"+i+"' size=5 value="+S[0][i]+">";	
		tr.appendChild(td);
	}
	return tb;	
}

percolate.tableSf = function (S) {// create input table with final values of S
	if (!S) {S=percolate.S}
    var tb = document.createElement('table');
	tb.id="effectiveState";
	var tbody = document.createElement('tbody');
	tb.appendChild(tbody);
	var n = S.length;
	for (var i in S[n-1]) { // first row contains native state
		var tr = document.createElement('tr');
		tbody.appendChild(tr);
		var td = document.createElement('td');
		td.innerHTML="<input id='Sf_"+i+"' size=5 value="+S[n-1][i]+">";	
		tr.appendChild(td);
	}
	return tb;	
}

percolate.tableSs = function (S) {// create input table for values of T
	if (!S) {S=percolate.S}
    var tb = document.createElement('table');
	//tb.style.borderSpacing=5;
	tb.border=1;
	tb.id = 'percolatedStatesTable';
	var tbody = document.createElement('tbody');
	tb.appendChild(tbody);
	for (var i in S[0]) {
		var tr = document.createElement('tr');
		tbody.appendChild(tr);
		for (var j in S) {
			//console.log(T[i][j])
			var td = document.createElement('td');
			//td.innerHTML="<input id='S_"+i+"_"+j+"'  size=1 value="+S[j][i]+">";
			td.innerHTML=S[j][i];
			tr.appendChild(td);
		}
		// Native State
	}
	return tb;	
}

percolate.remove_element_by_id=function (id) {
	if (document.getElementById(id)) {
		var e = document.getElementById(id);
		e.parentNode.removeChild(e);
	}
	return false;
}

console.log('percolate.js loaded');
