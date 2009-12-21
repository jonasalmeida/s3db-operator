function [y,z]=s3db_merge(x,z)

%S3DB_PERMIT_MERGE calculates merging of s3db operator states
%Syntax: [y,z]=s3db_merge(x,z)
%   where x is a character array* where each line contains a distinct
%   state and z (optional) lists the characters used by increasing
%   order of importance. By default z takes the alphabetic order. Proximal
%   (Local) and Distal (Global) permissions are distinguished by using,
%   respectively, lower and upper case letters. The dash charcater "-"
%   indicates a pass -, do not use it to indicate operator state. Ideally
%   only characters that have a lower and upper case should be used to
%   indicate state.
%
%   Note this function deals with merging only. The order of the
%   permissions in the columns is of no significance.
%
%   Note also that if numeric characters are used they wont have upper case
%   which implies that there can be only local permissions (i.e. z='012')
%
%   * it can be a cell array of strings or a single string matrix
%
%Example:
%   lala=['-sn';'--S';'-yy'];s3db_permit_merge(lala)
%   ans =
%   -yS
%
%Jonas ALmeida, 31 Dec 2008

if iscell(x);x=cell2char(x);end
if nargin<2;z=unique(lower([x(:)']));end

[n,m]=size(x);
y=char(['-'*ones(1,m)]);

% solve it one column at a time
for i=1:m
    xi=x(:,i);
    xi(find(xi=='-'))='';
    f=find(xi==upper(xi)); %do we have upper case (global) permissions?
    if ~isempty(f) %then we don't need to worry about the local permissions
        xi=xi(f); %and we need worry only about the (upper case) global permissions
    end
    if length(xi)>0
        xx=lower(xi); %to find index of each permission in the z scale
        xj=[];
        for j=1:length(xx)
            xj(j)=find(z==xx(j));
        end
        if xx==xi %local permissions (remember xx is lower case)
            y(i)=z(max(xj)); %use most permissive
        else % global permissions
            y(i)=upper(z(min(xj))); %use the most restrictive
        end
    else
        y(i)='-';
    end
end

function y=cell2char(x)

%if permissions are provided as a cell array they are converted here into a
%single character array

%how many cell strings?
n=length(x);
%what is the longest length?
m=zeros(n,1);
for i=1:n;m(i)=length(x{i});end;
m=max(m);
%Build since char of  "-"s
y=char(['-'*ones(n,m)]);
%Fill permissions that exist
for i=1:n
    if ~isempty(x{i});
        y(i,1:length(x{i}))=x{i};
    end
end


