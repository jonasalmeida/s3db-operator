function [Y,Z]=percolate(T,X,k,p)

%S3DB_PERMIT_CALC percolation of s3db permissions to calculate its effective value at each node
%Syntax: [Y,Z]=percolate(T,X,k)
%   T is a binary transition square matrix and X is the vector array with
%   the permissions. Note that this function works both with migrated and
%   unmigrated permissions. The third input argument indicates the length
%   of the permission state, which will be used in the migration between
%   transitions (inheritances) with the assistance of S3DB_PERMIT_MIGRATE.
%   The 4th input argument allows the use of othe permission codes than the
%   alphabetic order of whatever was used.
%
%   The seccond output argument will reccord the states for all iterations.
%   Consequently, the first column of Z is X and the last is Y.
%
%   The default value for k is 3
%
%   Example:
%
%   The behaviour of the percolation is illustrated for this 5 node
%   interaction
%
%   A-->B, A-->D; B-->C; C-->D; D-->E; E-->A
%
%   which corresponds to a transition matrix T,
%
%   T=[0 1 0 1 0;0 0 1 0 0;0 0 0 1 0;0 0 0 0 1;1 0 0 0 0]
%
%   T =
%
%     0     1     0     1     0
%     0     0     1     0     0
%     0     0     0     1     0
%     0     0     0     0     1
%     1     0     0     0     0
%
%   recalling that the first column of Z is the initial state, X, and the
%   last column is the final, stable, state, Y, analyse these solutions
%
%   X={'n','','','',''}
%
%Z=  'n'    'nnn'    'nnn'
%     ''    'nnn'    'nnn'
%     ''    '---'    'nnn'
%     ''    'nnn'    'nnn'
%     ''    '---'    'nnn'
%
%   X={'yny','yss','','',''}
%
%Z=  'yny'    'yny'    'yny'    'yny'    'ysy'
%    'yss'    'ysy'    'ysy'    'ysy'    'ysy'
%       ''    'yss'    'ysy'    'ysy'    'ysy'
%       ''    'yny'    'ysy'    'ysy'    'ysy'
%       ''    '---'    'yny'    'ysy'    'ysy'
%
%   X={'yNs','ysy','','',''}
%
%Z=  'yNs'    'yNs'    'yNs'    'yNs'    'yNy'
%    'ysy'    'yNy'    'yNy'    'yNy'    'yNy'
%       ''    'ysy'    'yNy'    'yNy'    'yNy'
%       ''    'yNs'    'yNy'    'yNy'    'yNy'
%       ''    '---'    'yNs'    'yNy'    'yNy'
%
%   X={'yNs-','ysy','','',''}
%
%Z=  'yNs-'    'yNs-'    'yNs-'    'yNs-'    'yNy-'
%    'ysy'     'ysy'     'ysy'     'ysy'     'ysy' 
%        ''    'ysy'     'ysy'     'ysy'     'ysy' 
%        ''    '---'     'ysy'     'ysy'     'ysy' 
%        ''    '---'     '---'     'ysy'     'ysy' 
%
%Jonas ALmeida, 31 December 2008

% set defaults
if nargin<3;k=3;end
if size(X,2)>1;X=X';end % to make sure X is processed as a vertical vector
n=length(X); %number of nodes
if size(T,1)~=n|size(T,1)~=size(T,2)
    error(['Transition matrix should be square with side of equal length to the state vector: ',num2str(n),'x',num2str(n)])
end


%calculations
Z=X; %start with current states
T=T==1; %in case T was provided in a non-binary format
% Find which transitions need computing
for g=2:100 %set maximum number of iterations here
    for j=1:n %for each column of the transition matrix
        Xj=migrate(X{j},k,0); %include one's own (no migration needed, it is there already
        for i=[find(T(:,j))]' %for those found to end in the j node
            Xj=[Xj,{migrate(Z{i,g-1},k,1)}]; % migrate permissions into it
        end
        Z(j,g)={s3db_merge(Xj)};
    end
    if strcmp([Z{:,g}],[Z{:,g-1}]); %if there was no change between two generations
        Z(:,end)=[]; % remove last (repeated) column
        break; %stop iteration
    end
end
Y=Z(:,end);








