#! /usr/bin/bash

if [ ! -d dist ] ; then
	npm run build
fi

npm run start
