// MIGRATE migrates s3db operator states 
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

console.log("migrate.js loaded")

function migrate(x,m,g) {
	if (!m) {var m=1}
	if (!g) {var g=1}
	var L=x.length;
	var M1=Math.floor(L/m);
	var M2=Math.ceil(L/m);
	var mm=M1+M2/L;

	if (M2===0) { // if no permissions are defined assign a pass, "-", to all of them
		for (var i=0; i<m; i++) {x+="-"}
	}
	else if (M1===0) { // if there are fewer digits that the defenition of state requires
		for (var i=L; i<m; i++) {x+=x[i-1]};
	}
	else if (M1>1) {x=x.slice(m,L)} // slice off parental state
	
	// else child state = parent state

	if (g>1) { // if additional migrations are to be calculated
	    console.log("g="+g+": "+x); //and returned to the console for inspection if you are using, say, firebug
		x=migrate(x,m,g-1);
	} 

	return x;
}



