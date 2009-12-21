function [y,x]=s3db_migrate(x,n,g)

%S3DB_PERMIT_MIGRATE migration of assigned permissions in S3DB inheritance
%Syntax: y=s3db_permits(x,n,g)
%  where x is the parental permission, n is the length of the state and g
%  is the number of generations being computed. By default n is 3
%  (for example, [view,edit,use]) and g is 1 (compute next generation).
%  If g=0 then the state of the source entity is computed.
%
%Jonas Almeida, December 30, 2008

%defaults
if nargin<3;g=1;end
if nargin<2;n=3;end

nx=length(x);
m1=floor(nx/n);m2=ceil(nx/n);
mm=m1+m2/n;

if m2==0 %if no permissions are defines declare passs for all "-"
    x=char(['-'*ones(1,n)]);
    y=x;
    
elseif mm<1 %there are fewer digits than the defenition of the state requires
    y=[x,char(x(end)*ones(1,n-nx))];
    x=y;
    
elseif m2==1 %there are just enough digits to define the current state
    y=x;
    
else
    y=[x(n+1:end),[char(ones(1,(n*m2-m1)-nx+1)*x(end))]];
end

% repeat for additional generations if need be
if g>1
    y=s3db_migrate(y,n,g-1);
elseif g==0
    y=x;
end
        


