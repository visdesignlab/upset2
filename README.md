# UpSet 2.0 – Visualizing Intersecting Sets

UpSet 2 is deployed at [https://upset.multinet.app/](https://upset.multinet.app/).  

Deployment Status: [![Netlify Status](https://api.netlify.com/api/v1/badges/edb8054f-7bfd-4b6a-8325-b26c279e2991/deploy-status)](https://app.netlify.com/sites/upset2/deploys)   

## About

UpSet is an interactive, web based visualization technique designed to analyze set-based data. UpSet visualizes both, set intersections and their properties, and the items (elements) in the dataset. 

Please see the http://upset.app for more info about UpSet. 

This version is a re-implementation using modern web technologies of [the original UpSet](https://vdl.sci.utah.edu/publications/2014_infovis_upset/).

UpSet 2 is described in this short poster: 
```
Kiran Gadhave, Hendrik Strobelt, Nils Gehlenborg, Alexander Lex
UpSet 2: From Prototype to Tool
Proceedings of the IEEE Information Visualization Conference – Posters (InfoVis ’19), 2019.
```

UpSet 2 is based on the original UpSet, which was first described in this paper: 

```
Alexander Lex, Nils Gehlenborg, Hendrik Strobelt, Romain Vuillemot, Hanspeter Pfister
UpSet: Visualization of Intersecting Sets
IEEE Transactions on Visualization and Computer Graphics (InfoVis), 20(12): 1983--1992, doi:10.1109/TVCG.2014.2346248, 2014.
```

## Local Deployment

1.  Clone the repository using <code>git clone</code> or download and extract the zip file.
2.  Open terminal in the cloned folder and run <code>yarn install</code>
3.  Run <code>yarn build</code> in the terminal to compile.
4.  Start a server using
    > <code>yarn dev</code>
5.  A browser window should open with the tool loaded. If it doesn't just go to the url pointed to in the terminal window.
