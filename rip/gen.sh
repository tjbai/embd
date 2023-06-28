#!/bin/bash

for year in {2017..2023}; do
    for term in Fall Spring Intersession; do
        echo $term $year
        python3 main.py $term $year --load
    done
done

