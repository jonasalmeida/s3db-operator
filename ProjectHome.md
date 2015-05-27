Code for propagation of S3DB user operator states, as described in

_**Almeida JS, Deus HF, Maass W. (2010) S3DB core: a framework for RDF generation and management in bioinformatics infrastructures.
BMC Bioinformatics. 2010 Jul 20;11(1):387. [PMID 20646315](http://www.ncbi.nlm.nih.gov/pubmed/20646315).**_

An S3DB operator is a function with states that propagate between entities of its core model. The mechanism of propagation makes use of three individual functions - merge, migrate and propagate. This projects hosts implementations of the code in various platforms developed to implement them, including the original generic version, written in m-code (runs in Matlab, Freemat and Octave). These three functions were also coded in javascript and a _browser based application_ was developed to illustrate how they work, with links to the .m and .js source code:

**Browser-based application**

http://s3db-operator.googlecode.com/hg/propagation.html

**Code**

[Source m and js files](http://s3db-operator.googlecode.com/hg)

[revision history](http://code.google.com/p/s3db-operator/source/list)